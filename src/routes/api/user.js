import AuthController from '../../controller/AuthController.js';

import UserController from '../../controller/UserController.js';
import User from '../../models/user.model.js';
//Express
import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

const app = express();
app.use(express.json());

/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: 로그인/로그아웃
 */

/**
 * @swagger
 * tags:
 *   name: USER
 *   description: 회원 정보 관련 API
 */

const phoneValidationRules = [
    body("phone_number").isMobilePhone().withMessage("유효한 전화번호을 입력하세요."),
    body("birth").isDate().withMessage("날짜 형식을 확인해주세요."),
    body("sex").isUppercase().withMessage("대문자로 입력해주세요"),
    body("interest").isUppercase().withMessage("대문자로 입력해주세요"),
    body("sign_route").isUppercase().withMessage("대문자로 입력해주세요"),
];

app.use((req, res, next) => {
    console.log(req);  
    next(); 
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - USER
 *     summary: 로그인
 *     description: 발급받은 JWT 토큰을 통해 로그인하는 API입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jwt_token 
 *         in: header  
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       400:
 *         description: Bad Request - Invalid login type
 */
router.get("/login", async (req, res) => {

    if(!req.user) return res.status(401).json({ message: "No token provided" });

    try{
        if (await TokenBlacklist.isBlacklisted(token)) { //blacklist확인
            return res.status(401).json({ error: 'Token is blacklisted' });
        }
        const userInfo = jwt.verify(token, process.env.JWT_SECRET); 
        res.status(200).json({ message: "Token is valid", user: userInfo.id });
    }
    catch{
        res.status(400).json({message : "Invalid Token Error!"});
    }
});

/**
 * @swagger
 * /user/signout:
 *   post:
 *     tags:
 *       - USER
 *     summary: 회원 탈퇴
 *     description: 회원탈퇴하는 API입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jwt_token  # Use underscore for consistency
 *         in: header  # Use header instead of headers
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.post("/signout", async (req, res)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await User.destroy({ where: { id: userId } });

        res.status(200).json({ message: "User account deleted successfully." });
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
})



/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags:
 *       - USER
 *     summary: 로그아웃
 *     description: 로그아웃 시 리프레시토큰을 삭제하고, 블랙리스트에 등록합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: refresh_token
 *         in: body
 *         description: refresh token삭제..
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.post("/logout", async (req, res)=>{
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    try {
        await AuthController.deleteRefreshToken(refreshToken);
        await TokenBlacklist.addToBlacklist(refreshToken);
        return res.status(200).json({message : "User refresh deleted successfully."})
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
})

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     tags:
 *       - USER
 *     summary: 리프레쉬 토큰 재 발급
 *     description: 토큰 만료 시, 액세스토큰을 재 발급해주는 api입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: refresh_token
 *         in: header  # Use header instead of headers
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       401:
 *         description: Unauthorized!
 *      403:
 *          description: Invalid refresh token
 */
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    // 리프레시 토큰이 제공되지 않거나 블랙리스트에 있는 경우 처리
    if (!refreshToken || await TokenBlacklist.isBlacklisted(refreshToken)) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    try {
        // 리프레시 토큰 검증
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // 새로운 액세스 토큰 발급
        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // 새로운 리프레시 토큰 저장
        const newRefreshToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );

        await AuthController.saveRefreshToken(payload.userId, newRefreshToken);

        // 응답 반환
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Refresh token verification error:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
});


/**
 * @swagger
 * /user/userinfos:
 *   patch:
 *     tags:
 *       - USER
 *     summary: 사용자 추가 정보 등록
 *     description: 사용자의 성별/생일/관심사 등의 추가 정보를 DB에 등록하는 API입니다.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sex:
 *                 type: string
 *                 description: 성별 ENUM('MALE', 'FEMALE', 'OTHER')
 *               interest:
 *                 type: string
 *                 description: 관심분야 ENUM('POO', 'ACTIVITY', 'SLEEP', 'DIGITALPET')
 *               phone_number:
 *                 type: string
 *                 description: 전화번호(010-0000-0000)
 *               sign_route:
 *                 type: string
 *                 description: 가입경로 ENUM('HOSPITAL', 'SNS', 'BLOG', 'SEARCH', 'FRIEND', 'OTHER')
 *               birth:
 *                 type: string
 *                 description: 생년월일(YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
   router.patch("/userinfo" ,async(req, res)=>{
    try{
        const { sex, interest, phone_number, sign_route, birth } = req.body;
        const foundUser = req.user

        const userData = {
            sex,
            interest,
            phone_number,
            sign_route,
            birth
        };
        await UserController.updateUserInfo(foundUser, userData);
    }
    catch(error){
        console.error("Refresh token verification error:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
   });

/**
 * @swagger
 * /user/users:
 *   patch:
 *     tags:
 *       - USER
 *     summary: 사용자 정보 수정정
 *     description: 사용자의 성별/생일/관심사 등의 정보를 update하는 API입니다.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sex:
 *                 type: string
 *                 description: 성별 ENUM('MALE', 'FEMALE', 'OTHER')
 *               interest:
 *                 type: string
 *                 description: 관심분야 ENUM('POO', 'ACTIVITY', 'SLEEP', 'DIGITALPET')
 *               phone_number:
 *                 type: string
 *                 description: 전화번호(010-0000-0000)
 *               birth:
 *                 type: string
 *                 description: 생년월일(YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.patch("/users" ,async(req, res)=>{
    try{
        const { sex, interest, phone_number, birth } = req.body;
        const newuser = req.user;
        const userData = {
            sex,
            interest,
            phone_number,
            birth
        };
        await UserController.updateUserInfo(newuser, userData);
    }
    catch(error){
        console.error("Refresh token verification error:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
   });
export { router as userRouter };


/**
 * @swagger
 * /user/mypage:
 *   patch:
 *     tags:
 *       - USER
 *     summary: 마이페이지지
 *     description: 마이페이지 - 사용자정보확인API입니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.get("/mypage", async (req,res)=>{
    if(!req.user) return res.status(401).json({ message: "No token provided" });
    try{
       const userData = await UserController.getUserData(req.user);
       return res.status(200).json(userData);
    }
    catch(error){
        console.error("Refresh token verification error:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
});
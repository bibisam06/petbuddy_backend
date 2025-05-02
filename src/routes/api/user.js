import AuthController from '../../controller/AuthController.js';
import UserController from '../../controller/UserController.js';
import User from '../../models/user.model.js';
//Express
import bcrypt from 'bcrypt';
import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

//middle-ware
import { authenticateUser } from '../../middleware/authValidation.js';
import { sendError, sendResponse } from '../../utils/responseHandler.js';

const router = express.Router();

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
    body("gender").isUppercase().withMessage("대문자로 입력해주세요"),
    body("interest").isUppercase().withMessage("대문자로 입력해주세요"),
    body("sign_route").isUppercase().withMessage("대문자로 입력해주세요"),
];

router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       400:
 *         description: Bad Request - Invalid login type
 */
router.post("/login", authenticateUser, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if(!req.user) {
        const error = new Error("UnAuthorized Errror");
            error.status = 403;
            throw error;
    }

    try{

        // if (await AuthController.isBlacklisted(token)) { 
        //     return res.status(403).json({ error: 'Token is blacklisted' });
        // }
       
        const userInfo = jwt.verify(token, process.env.JWT_SECRET); 
        return sendResponse(res, {data : null}, {responseMessage : "User logged in successfully"});
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
});

/**
    * @swagger
    * /user/email-login:
    *   post:
    *     tags:
    *       - USER
    *     summary: 이메일로 로그인하기 기능 API 
    *     description: 이메일과 비밀번호를 통해 새로운 jwt를 발급받는 API입니다. 
    *     produces:
    *       - application/json
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 description: 이메일 - (아이디)
    *               password:
    *                 type: string
    *                 description: 패스워드
    *               
    *     responses:
    *       200:
    *         description: user logged in successfully
    *       400: 
    *         description: Wrong Email
    *       500: 
    *         description: Error occurred!
    */ //TODO : 에러코드 변경 안되는 문제 
router.post("/email-login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            const error = new Error("Unregistered Email Error");
            error.status = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.user_password);
        if (!isPasswordMatch) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const jwtTokens = await AuthController.createTokens(user);

        
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "User logged in successfully with email",
            data: jwtTokens
        });
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
});


/**
 * @swagger
 * /user/signout:
 *   post:
 *     tags:
 *       - USER
 *     summary: 회원 탈퇴
 *     description: 회원탈퇴하는 API입니다. - 리프레쉬 토큰을 삭제합니다 
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       500:
 *         description: Invalid token.
 */
router.post("/signout",authenticateUser,async (req, res)=>{
    try {
        const deletedUser = req.user.user_id;

        await User.destroy({ where: { user_id : deletedUser } });

        await AuthController.deleteRefreshToken(deletedUser);

       
        return sendResponse(res, {data : null}, {responseCode : 200}, {responseMessage : "User account deleted successfully."});
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
});



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
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.post("/logout", async (req, res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        const error = new Error("Invalid email or password");
        error.status = 403;
        throw error;
    }

    try {
        await AuthController.deleteRefreshToken(token);
        await AuthController.addToBlackList(token);
        return sendResponse(res, {data : null}, {responseMessage : "User RefreshToken is deleted successfully"});
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
});

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     tags:
 *       - USER
 *     summary: 리프레쉬 토큰 재발급
 *     description: 토큰 만료 시, 액세스토큰을 재발급해주는 API입니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access token 재발급 성공
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Invalid refresh token
 */
router.post("/refresh", authenticateUser, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const jwt_token = authHeader && authHeader.split(' ')[1]; 
   

    if (!jwt_token || await AuthController.isBlacklisted(jwt_token)) {
        const error = new Error("Invalid email or password");
        error.status = 403;
        throw error;
    }

    try {
    
        const newAccessToken = jwt.sign(
            { userId: newuser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
         );

    
        const newRefreshToken = jwt.sign(
            {  userId: newuser.id },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );

        await AuthController.saveRefreshToken(newRefreshToken, newuser.id);
        const tokens = {
            accessToken : newAccessToken,
            refreshToken : newRefreshToken
        };
        return sendResponse(res, {data : tokens});
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
});




/**
 * @swagger
 * /user/users:
 *   patch:
 *     tags:
 *       - USER
 *     summary: 사용자 정보 수정
 *     description: 사용자의 성별/생일/관심사 등의 정보를 update하는 API입니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 description: 성별 ENUM('MALE', 'FEMALE', 'OTHER')
 *               interest:
 *                 type: string
 *                 description: 관심분야 ENUM('POO', 'ACTIVITY', 'SLEEP', 'DIGITALPET')
 *               phone_number:
 *                 type: string
 *                 description: 전화번호(010-0000-0000)
 *               birth:
 *                 type: 2024-04-29
 *                 description: 생년월일(YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.patch("/users", authenticateUser,phoneValidationRules, async(req, res)=>{
    try{ 
        const user = req.user;
 
        await UserController.updateUserInfo(user, req.body);
        return sendResponse(res, {data : req.body});
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
   });


/**
 * @swagger
 * /user/mypage:
 *   get:
 *     tags:
 *       - USER
 *     summary: 마이페이지
 *     description: 마이페이지 - 사용자정보확인API입니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.get("/mypage",authenticateUser ,async (req,res)=>{
    if(!req.user) {
        const error = new Error("Token is not found");
        error.status = 404;
        throw error;
    }
    try{
       const userData = await UserController.getUserData(req.user);
       return sendResponse(res, {data:userData});
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
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
 *     security:
 *       - bearerAuth: []   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: 성별
 *               interest:
 *                 type: string
 *                 enum: [POO, ACTIVITY, SLEEP, DIGITALPET]
 *                 description: 관심분야
 *               phone_number:
 *                 type: string
 *                 pattern: '^010-[0-9]{4}-[0-9]{4}$'
 *                 description: 전화번호 (010-0000-0000 형식)
 *               sign_route:
 *                 type: string
 *                 enum: [HOSPITAL, SNS, BLOG, SEARCH, FRIEND, OTHER]
 *                 description: 가입경로
 *               birth:
 *                 type: string
 *                 format: date
 *                 description: 생년월일 (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.patch("/userinfos" ,authenticateUser, phoneValidationRules ,async(req, res)=>{
    try{
        const { gender, interest, phone_number, sign_route, birth } = req.body;
    
        const foundUser = req.user
        const userData = {
            gender,
            interest,
            phone_number,
            sign_route,
            birth
        };
        await UserController.updateUserInfo(foundUser, userData);
        return sendResponse(res, {data : userData});
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.status ?? 500;
        return sendError(res, { errorMessage: error.message }, { responseCode: statusCode });
    }
   });


   export { router as userRouter };


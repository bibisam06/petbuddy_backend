import AuthController from '../../controller/auth.controller.js';
import UserController from '../../controller/user.controller.js';
import User from '../../models/user.model.js';

//error
import { UserNotFoundError, PasswordMisMatch, UnAuthorizedError }from '../../error/error.handler.js';

//Express
import bcrypt from 'bcrypt';
import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

//middle-ware
import { authenticateUser } from '../../middleware/jwt.middleware.js';
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
router.post("/login", authenticateUser, async (req, res, next) => {

    try{
        if(!req.user) {
        throw new UserNotFoundError();
    }   
        if (await AuthController.isBlacklisted(token)) { 
            throw new UnAuthorizedError();
        }

        const userInfo = jwt.verify(token, process.env.JWT_SECRET); 
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "사용자 로그인 성공",
            data : null
        });
    }
    catch(error){
        next(error);
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
    *                 example : h@naver.com
    *               password:
    *                 type: string
    *                 example : string
    *                 description: 패스워드
    *               
    *     responses:
    *       200:
    *         description: user logged in successfully
    *       400: 
    *         description: Wrong Email
    *       500: 
    *         description: Error occurred!
    */ 
router.post("/email-login", async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new UserNotFoundError();
        }

        const isPasswordMatch = await bcrypt.compare(password, user.user_password);
        if (!isPasswordMatch) {
            throw new PasswordMisMatch();
        }

        const jwtTokens = await AuthController.createTokens(user);
        await AuthController.saveRefreshToken(jwtTokens.refreshToken, user.user_id);
        
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "사용자 로그인 성공",
            data: jwtTokens
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /user/signout:
 *   delete:
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
router.delete("/signout",authenticateUser,async (req, res, next)=>{
    try {
        const deletedUser = req.user.user_id;
        await User.destroy({ where: { user_id : deletedUser } });
        await AuthController.deleteRefreshToken(deletedUser); //del : usrId
        await AuthController.addToBlackList(req.token); //add : token
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "사용자 계정 탈퇴 완료",
            data : null
        });
    } catch (error) {
        next(error);
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
router.post("/logout",authenticateUser ,async (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        throw new CustomError("토큰이 존재하지 않습니다", 404);
    }

    try {
        await AuthController.deleteRefreshToken(token);
        await AuthController.addToBlackList(token);
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "사용자 로그아웃 성공",
            data : null
        });
    }catch(error){
        next(error);
    }
});

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     tags:
 *       - USER
 *     summary: 리프레쉬 토큰 재발급
 *     description: 토큰 만료 시, 리프레쉬 토큰을 통해 액세스토큰을 재발급해주는 API입니다.
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
router.post("/refresh", authenticateUser ,async (req, res, next) => {
try {
    const jwt_token = req.token;

    if (!jwt_token) {
        throw new CustomError("토큰이 존재하지 않습니다.", 400);
    }

    // 블랙리스트 확인
    const isBlacklisted = await AuthController.isBlacklisted(jwt_token);
    if (isBlacklisted) {
        throw new CustomError("블랙리스트에 등록된 토큰입니다", 403);
    }
    const userId = req.user.user_id;
    const founduser = await User.findOne({ where: { user_id: userId } });

    if (!founduser) {
    throw new CustomError("사용자가 존재하지 않습니다", 404);
    }

    // 기존 리프레시 토큰 제거
    await AuthController.deleteRefreshToken(jwt_token);

    // 새 토큰 생성
    const newAccessToken = jwt.sign(
    { userId: founduser.user_id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
    );

    const newRefreshToken = jwt.sign(
    { userId: founduser.user_id },
    process.env.JWT_SECRET,
    { expiresIn: '10d' }
    );

    // 새 리프레시 토큰 저장
    await AuthController.saveRefreshToken(newRefreshToken, founduser.user_id);

    const tokens = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
    };

    return sendResponse(res, { 
        responseCode : 200,
        responseMessage : "새로운 토큰이 발급되었습니다",    
        data: tokens 
    });

} catch (error) {
    next(error);
};




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
 *             required:
 *               - gender
 *               - interest
 *               - phone_number
 *               - birth
 *             properties:
 *               gender:
 *                 type: string
 *                 description: 성별
 *                 enum: [MALE, FEMALE, OTHER]
 *               interest:
 *                 type: string
 *                 description: 관심분야
 *                 enum: [POO, ACTIVITY, SLEEP, DIGITALPET]
 *               phone_number:
 *                 type: string
 *                 description: 전화번호(010-0000-0000)
 *               birth:
 *                 type: string
 *                 format: date
 *                 description: 생년월일(YYYY-MM-DD)
 *             example:
 *               gender: FEMALE
 *               interest: SLEEP
 *               phone_number: 010-9876-5432
 *               birth: 1998-12-05
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.patch("/users", authenticateUser,phoneValidationRules, async(req, res, next)=>{
    try{ 
        const user = req.user;
//TODO :  blacklist - middleware c
    const isBlacklisted = await AuthController.isBlacklisted(jwt_token);
    if (isBlacklisted) {
        throw new CustomError("블랙리스트에 등록된 토큰입니다", 403);
    }
        await UserController.updateUserInfo(user, req.body);
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "사용자 정보 수정 완료",
            data: user
        });
    }
    catch(error){
        next(error);
    }
});


// TODO : created_at, updated_at 두 값 수정하기

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
router.get("/mypage",authenticateUser ,async (req,res, next)=>{
    try{
        if(!req.user) {
        const error = new Error("Token is not found");
        error.status = 404;
        throw error;
        }
        //TODO : black-list 
        const userData = await UserController.getUserData(req.user);
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "마이페이지 정보 조회 성공",
            data : userData
        });
    }
    catch(error){
        next(error);
    }
});

//TODO : 사용자 정보가 업데이트 되지 않는 문제 

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
router.patch("/userinfos" ,authenticateUser, phoneValidationRules ,async(req, res, next)=>{
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
        return sendResponse(res, {
            responseCode : 200,
            responseMessage : "사용자 정보가 추가등록되었습니다.",
            data : userData
        });
    }
    catch(error){
        next(error);
    }
    });
});

export { router as userRouter };

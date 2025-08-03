import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import express from "express";
import { body } from "express-validator";

//controllers
import AuthController from '../../controller/auth.controller.js';
import User from "../../models/user.model.js";

//middle - ware 
import validate from '../../middleware/validator.middleware.js';
import { AlreadyRegisterdError, NoTokenError } from '../../error/error.handler.js';
const router = express.Router();
dotenv.config();

//utils 
import { sendError, sendResponse } from '../../util/response.util.js';
import { notifyNewUser } from '../../util/slack.util.js';
// for bcrypt library 
const SALT_ROUNDS = 10;

/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: 회원가입
 */

const userValidationRules = [
    body("email").isEmail().withMessage("유효한 이메일을 입력하세요.")
];


//TODO : 앱 플레이 스토어에 등록 후 개발 예정 .. (**)

/**
 * @swagger
 * /auth/kakao/token:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 카카오 인증 토큰 발급 api
 *     description : 카카오 access token을 발급받고 JWT토큰을 반환하는 api입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: 카카오 인증 코드
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.get("/kakao/token", async (req, res, next) => {
    try {
        const { code } = req.query;
        if( !code ){
            throw new NoTokenError();
        }
        const kakaoToken = await AuthController.getKakaoToken(code);
        const jwtTokens = await AuthController.signWithKakao(kakaoToken);
        
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "User logged in successfully with email",
            data: jwtTokens
        });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});


/**
 * @swagger
 * /auth/naver/token:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 네이버 인증토큰 발급 API
 *     description : 네이버 access token을 발급받고 jwt를 반환하는 api 입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: 네이버 인증 코드
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 *       500: 
 *          description: Error occured!
 */
router.get("/naver/token", async (req, res, next) => {
    try {
        const { accessToken } = req.query; 

        if( !accessToken ){
            throw new NoTokenError();
        }
        const naverToken = await AuthController.getNaverToken(accessToken);
        const jwtTokens = await AuthController.signWithKakao(naverToken);

        return sendResponse(res, {
                    responseCode: 200,
                    responseMessage: "User logged in successfully with email",
                    data: jwtTokens
                });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});

/**
 * @swagger
 * /auth/naver/callback:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 네이버 콜백 API 
 *     description : naver 콜백 API 입니다..일단 구현 중 입니다.. 뭔지는잘모르겠음 
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: 
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 *       500: 
 *          description: Error occured!
 */
router.get("/naver/callback");


/**
    * @swagger
    * /auth/email:
    *   post:
    *     tags:
    *       - AUTH
    *     summary: 이메일로 회원가입 기능 API
    *     description: 이메일로 회원가입기능입니다.
    *     produces:
    *       - application/json
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 description: 이름
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
    */
router.post("/email", userValidationRules, validate, async (req, res, next) => {
    try {

        const { name, email, password } = req.body; 
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.findOne({
            where: { email },
            attributes: ['email']
        });      

        if (user) {
            throw new AlreadyRegisterdError();
        }

        const newuser = await User.create({
            user_name: name,
            email, 
            user_password: hashedPassword
        });

          await notifyNewUser(newuser); // ✅ 슬랙 알림 호출

        const jwtTokens = await AuthController.createTokens(newuser);
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "사용자 로그인 성공",
            data: jwtTokens
        });
    } catch (error) {
        console.error(error.message);
        next(error);
        
    }
});



export { router as authRouter };


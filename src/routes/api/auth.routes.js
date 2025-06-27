import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import express from "express";
import { validationResult , body } from "express-validator";

import AuthController from '../../controller/auth.controller.js';
import User from "../../models/user.model.js";


//middle - ware 
import { sendError, sendResponse } from '../../util/response.util.js';

const router = express.Router();
dotenv.config();
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


router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

//TODO : 앱 플레이 스토어에 등록 후 개발 예정 .. 
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
router.get("/kakao/token", async (req, res) => {
    const { code } = req.query;

    try {
        const kakaoToken = await AuthController.getKakaoToken(code);
        const jwtTokens = await AuthController.signWithKakao(kakaoToken);
        
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "User logged in successfully with email",
            data: jwtTokens
        });
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status || 500;
        return sendError(res, {
            errorMessage: error.message,
            responseCode: statusCode
        });
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
router.get("/naver/token", async (req, res) => {
    const { accessToken } = req.query; 

    try {
        const naverToken = await AuthController.getNaverToken(accessToken);
        const jwtTokens = await AuthController.signWithKakao(naverToken);

        return sendResponse(res, {
                    responseCode: 200,
                    responseMessage: "User logged in successfully with email",
                    data: jwtTokens
                });
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status || 500;
        return sendError(res, {
            errorMessage: error.message,
            responseCode: statusCode
        });
    }
});


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
router.post("/email", userValidationRules, async (req, res) => {
    try {
        //  유효성 검사 실행
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, {
                errorMessage: "유효하지 않은 이메일 형식입니다.",
                responseCode: 400
            });
        }

        const { name, email, password } = req.body; 
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.findOne({
            where: { email },
            attributes: ['email']
        });      

        if (user) {
            return sendError(res, {
                errorMessage : "이미 등록되어있는 이메일입니다",
                responseCode : 409
            });
        }

        let newuser = await User.create({
            user_name: name,
            email, 
            user_password: hashedPassword
        });

        const jwtTokens = await AuthController.createTokens(newuser);
        return sendResponse(res, {
            responseCode: 200,
            responseMessage: "사용자 로그인 성공",
            data: jwtTokens
        });
    } catch (error) {
        console.error(error.message);
        const statusCode = error.status || 500;
        return sendError(res, {
            errorMessage: error.message,
            responseCode: statusCode
        });
    }
});



export { router as authRouter };


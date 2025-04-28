import dotenv from "dotenv";
import express from "express";
import { body } from "express-validator";
import AuthController from '../../controller/AuthController.js';
import User from "../../models/user.model.js";


const router = express.Router();
dotenv.config();
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

        return res.status(200)
           .set("Authorization", `Bearer ${jwtTokens.accessToken}`) 
           .json({                  
                refreshToken: jwtTokens.refreshToken
           }); 
    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: "Internal Server Error", error });
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

        return res.status(200)
           .set("Authorization", `Bearer ${jwtTokens.accessToken}`) 
           .json({          
                refreshToken: jwtTokens.refreshToken
           }); 
    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
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
   router.post("/email", userValidationRules, async (req, res) =>{
   try{ //TODO : userValidationRules 작동 안하는 문제
    const { name, email, password }  = req.body; 

    const user = await User.findOne({
        where: { email },
        attributes: ['email']
      });      


    if(user){
        return res.status(400).json({error : "Invalid User Eamil : Already Registered!"});
    }
    
    let newuser = await User.create({
        user_name : name,
        email, 
        password
    });

    const jwtTokens = await AuthController.createTokens(newuser);
    return res.status(201)

    .set("Authorization", `Bearer ${jwtTokens.accessToken}`) 
    .json({          
         refreshToken: jwtTokens.refreshToken
    }); 
   }
   catch(error){
        console.log(error.errors)
        console.error("Error occured:", error.message);
        return res.status(500).json({error : "Internal Server Error"});
   }
});


export { router as authRouter };


import express from "express";
import { body } from "express-validator";
const router = express.Router();

import AuthController from '../../controller/AuthController.js';
/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: 로그인/로그아웃
 */

const userValidationRules = [
    body("email").isEmail().withMessage("유효한 이메일을 입력하세요.")
];

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
        const jwt = await AuthController.signWithKakao(kakaoToken);

        res.status(200)
           .set("Authorization", `Bearer ${jwt.accessToken}`) // JWT를 헤더에 포함
           .json({                  // 객체 리터럴을 올바르게 사용
                refreshToken: jwt.refreshToken
           }); 
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /auth/naver/token:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 네이버 인증토큰 발급 API
 *     description : 네이버 access token을 발급요청하는 api입니다.
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
        const jwt = await AuthController.signWithKakao(naverToken);

        res.status(200)
           .set("Authorization", `Bearer ${jwt.accessToken}`) 
           .json({          
                refreshToken: jwt.refreshToken
           }); 
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
    * @swagger
    * /auth/email:
    *   post:
    *     tags:
    *       - AUTH
    *     summary: 이메일로 로그인 기능 API
    *     description: 이메일로 로그인하기 기능입니다.
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
    *     responses:
    *       200:
    *         description: user logged in successfully
    *       400: 
    *         description: Wrong Email
    *       500: 
    *         description: Error occurred!
    */
   router.post("/email", userValidationRules, async (req, res) =>{
   try{
    const { email, password }  = req.body; //이따가 추가할거임..

    let user = await user.create({
        email, 
        password
    });

    const jwt = await AuthController.cretaeTokens(user);
    res.status(200)
    .set("Authorization", `Bearer ${jwt.accessToken}`) 
    .json({          
         refreshToken: jwt.refreshToken
    }); 
   }
   catch(eror){
        console.error("Error occured:", error.message);
        res.status(500).json({error : "Internal Server Error"});
   }
})


export { router as authRouter };


import express from "express";
const router = express.Router();

import AuthController from '../../controller/AuthController.js';
/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: 카카오 로그인 api
 */



/**
 * @swagger
 * auth/kakao/token:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 카카오 인증 토큰 발급 api
 *     description : 카카오 access token을 발급받고 JWT토큰을 반환하는 api입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: accessToken
 *       in: query
 *       description: 카카오 인증 코드
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.get("/kakao/token", async (req, res) => {
    const { accessToken } = req.query;

    try {
        const kakaoToken = await AuthController.getKakaoToken(accessToken);
        console.log("kakao : " + kakaoToken);

        const jwt = await AuthController.sign(kakaoToken);

        res.status(200)
           .set("Authorization", `Bearer ${jwt}`) // JWT를 헤더에 포함
           .json({ kakaoToken });  // 응답 데이터
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * auth/naver/token:
 *   get:
 *     tags:
 *       - AUTH
 *     name : 네이버 인증토큰 발급 API
 *     description : 카카오 access token을 발급요청하는 api입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: accessToken
 *       in: path
 *       description: 카카오 인증 코드
 *       required: true
 *       type: string
 *     - name: logintype
 *       in: path
 *       description: 로그인 종류( kakao , google, naver 등 )
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.get("/naver/token", async (req, res) => {
    const { accessToken } = req.query; 
    //TODO : 네이버 토큰발급 + JWT 토큰발급 및 저장..
});


export { router as authRouter };

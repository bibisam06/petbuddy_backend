import express from 'express';
// controller Import 
import { fitBarkRedirect , fitBarkOAuth, fitBarkRefresh} from '../../controller/bark.controller.js';

// middleware.js
import {authenticateUser} from '../../middleware/jwt.middleware.js';
const router = express.Router();

/** @swagger
 * tags:
 *   name: BARK
 *   description: woof...woof...(Fitbarks)
 */

router.use(authenticateUser);
/**
 * @swagger
 * /bark/redirect:
 *   get:
 *     tags:
 *       - BARK
 *     summary: "REDIRECT"
 *     description: "FitBark OAuth 사용자 정보를 반환하는 리다이렉트 경로입니다. - 프론트 사용아닙니다."
 *     responses:
 *       200:
 *         description: "강아지 조회 성공"
 *       500:
 *         description: "서버 오류"
 */
router.get("/redirect", fitBarkRedirect)


/**
 * @swagger
 * /bark/token:
 *   get:
 *     tags:
 *       - BARK
 *     name : 핏바크 인증 토큰 발급 api
 *     description : FitBark access token을 발급받고 토큰을 반환하는 api입니다. - Redis 
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: Fit-Bark Auth Token 을 반환하는 API 입니다. 
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.get("/token", fitBarkOAuth)


/**
 * @swagger
 * /bark/refresh:
 *   get:
 *     tags:
 *       - BARK
 *     name : 핏바크 인증 토큰 재 발급 코드 API 
 *     description : FitBark access Token Refresh API 입니다....
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: Fit-Bark Auth Token 을 반환하는 API 입니다. 
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.get("/refresh", fitBarkRefresh)


export { router as barkRouter };
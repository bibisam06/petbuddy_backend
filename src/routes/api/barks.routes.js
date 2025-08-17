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

// router.use(authenticateUser);
/**
 * @swagger
 * /bark/redirect:
 *   get:
 *     tags:
 *       - BARK
 *     summary: "REDIRECT"
 *     description: "FitBark OAuth 사용자 정보를 반환하는 리다이렉트 경로입니다. - 프론트 사용아닙니다."
 *     parameters:
 *       - name: user_id
 *         in: query
 *         description: "사용자 ID (토큰과 매핑할 유저)"
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: "강아지 조회 성공"
 *       500:
 *         description: "서버 오류"
 */
router.get("/redirect", fitBarkRedirect)



export { router as barkRouter };
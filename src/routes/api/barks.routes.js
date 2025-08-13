import express from 'express';
// controller Import 
import { fitBarkRedirect } from '../../controller/bark.controller.js';
const router = express.Router();

/** @swagger
 * tags:
 *   name: BARK
 *   description: woof...woof...(Fitbarks)
 */

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


export { router as barkRouter };
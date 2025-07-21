import express from 'express';
import { returnWeatherGrade } from '../../controller/weather.controller.js';
import { authenticateUser } from '../../middleware/jwt.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: WEATHER
 *   description: 날씨/미세먼지 관련 API 모음입니다.
 */

router.use(authenticateUser);

/**
 * @swagger
 * /weather/current:
 *   get:
 *     tags:
 *       - WEATHER
 *     summary: 현재 날씨 확인 API, 1시간마다 적합도 update용입니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "37.5665"
 *       - name: lon
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "126.9780"
 *       - name: city
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "Seoul"
 *     responses:
 *       200:
 *         description: 산책 적합도 계산 완료 
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
router.get("/current", returnWeatherGrade);


//export 
export { router as wedRouter };


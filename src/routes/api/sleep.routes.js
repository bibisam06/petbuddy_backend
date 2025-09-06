import express from 'express';

const router = express.Router();

//middle - ware - import
import { authenticateUser } from '../../middleware/jwt.middleware.js';

// import controller
import { getHourlySleepStatus } from '../../controller/sleep.controller.js';
/**
 * @swagger
 * tags:
 *   name: SLEEP
 *   description: "sleep log 관련 API 모음입니다."
 */

router.use(authenticateUser);

/**
 * @swagger
 * /sleep/hourly-status:
 *   get:
 *     tags:
 *       - SLEEP
 *     summary: "SLEEP - HOURLY"
 *     description: "FitBark 수면량을 1시간 단위로 집계하는 API 입니다."
 *     parameters:
 *       - name: pet_id
 *         in: query
 *         description: "강아지 ID"
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "강아지 조회 성공"
 *       500:
 *         description: "서버 오류"
 */
router.get("/sleep/hourly-status", getHourlySleepStatus);

export { router as sleepRouter };
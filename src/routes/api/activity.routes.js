import express from 'express';
//middlewares 
import { authenticateUser} from '../../middleware/jwt.middleware.js';
//controllers
import { getMonthlyActivity, saveActivity } from '../../controller/activity.controller.js';

const router = express.Router();


router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: ACTIVITY
 *   description: "활동량 관련 API 모음입니다."
 */

/**
 * @swagger
 * /activity/save:
 *   post:
 *     tags:
 *       - ACTIVITY
 *     summary: "시간당 활동량 저장 API - 구현중..."
 *     description: "강아지의 하루 시간당 활동량(걸음수)을 저장하는 API입니다."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pet_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 강아지 ID ... 1....2....3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-17"
 *               hourly_steps:
 *                 type: array
 *                 description: 시간대별 걸음 수 (0~23시), hour(0~23) + steps:(1234)형식으로 전송
 *                 items:
 *                   type: object
 *                   properties:
 *                     hour:
 *                       type: integer
 *                       example: 10
 *                     steps:
 *                       type: integer
 *                       example: 1234
 *     responses:
 *       200:
 *         description: "강아지 활동량 저장 성공"
 *       500:
 *         description: "서버 오류"
 */
router.post("/save", saveActivity);

/**
 * @swagger
 * /activity/monthly-mean:
 *   post:
 *     tags:
 *       - ACTIVITY
 *     summary: "중앙값 조회 기능 - 구현중"
 *     description: "한달 간의 평균값(중앙값)을 반환하는 API 입니다"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "강아지 조회 성공"
 *       500:
 *         description: "서버 오류"
 */
router.get("/monthly-mean", getMonthlyActivity);


export { router as activityRouter };

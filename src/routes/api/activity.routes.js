import express from 'express';

//middlewares 
import { authenticateUser} from '../../middleware/jwt.middleware.js';

//controllers
import { getHourlyValues, getDailyValues} from '../../controller/activity.controller.js';

const router = express.Router();

//auth - barear
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: ACTIVITY
 *   description: "활동량 관련 API 모음입니다."
 */

/**
 * @swagger
 * /activity/hourly-status:
 *   get:
 *     tags:
 *       - BARK
 *     summary: "ACTIVITY"
 *     description: "FitBark 걸음수(활동량) 1시간 단위로 조회하는 API 입니다."
 *     parameters:
 *       - name: pet_id
 *         in: query
 *         description: "사용자 ID"
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
router.get("/hourly-status", getHourlyValues)



/**
 * @swagger
 * /activity/daily-status:
 *   get:
 *     tags:
 *       - BARK
 *     summary: "ACTIVITY"
 *     description: "FitBark 활동량 하루 단위로 조회하는 API 입니다."
 *     parameters:
 *       - name: pet_id
 *         in: query
 *         description: "pet ID "
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
router.get("/daily-status", getDailyValues);


export { router as activityRouter };

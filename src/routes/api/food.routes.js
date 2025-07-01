
import express from 'express';
import { convertFood, getAllFood } from '../../controller/food.controller.js';
import { petMiddleware , calculate_reamains} from '../../middleware/dog.middleware.js';
const router = express.Router();


router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

console.log("🍖 FoodRouter loaded");

/**
 * @swagger
 * /food/foods:
 *   get:
 *     tags:
 *       - FOOD
 *     summary: 전체 사료 조회 API
 *     description: 데이터 베이스 안에 있는 모든 사료를 조회하는 API입니다...!
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       400:
 *         description: Bad Request - Invalid login type
 */
router.get("/foods", getAllFood);

// TODO : 사료 추가 및 변경 - (1)

/**
 * @swagger
 * /food/report:
 *   post:
 *     tags:
 *       - FOOD
 *     summary: 사료 변경 기능 API
 *     description: 기존 사료 로그를 마감처리하고 새로운 사료 로그를 생성합니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: food_id
 *         required: true
 *         description: 새로 급여할 사료 ID
 *         schema:
 *           type: integer
 *       - name: dogOrder
 *         in: query
 *         required: true
 *         description : 강아지 순서 1...2...3...
 *         schema:
 *           type: string
 *           example: ""
 *     responses:
 *       200:
 *         description: 사료 변경 성공
 *       401:
 *         description: 인증 실패 - JWT 토큰이 유효하지 않음
 *       400:
 *         description: 잘못된 요청 - 필수 파라미터 누락 또는 형식 오류
 */
// router.post("/report", petMiddleware, convertFood);
router.post("/report", petMiddleware, (req, res, next) => {
    console.log("report route reached");
   convertFood(req, res, next);
});

export {router as FoodRouter }; 
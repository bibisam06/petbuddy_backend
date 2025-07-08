
import express from 'express';
import { convertFood, getAllFood, endFeedReport, addFeedReport } from '../../controller/food.controller.js';
import { calculate_reamains} from '../../middleware/dog.middleware.js';
const router = express.Router();


router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


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
 *       - name: pet_id
 *         in: query
 *         required: true
 *         description : 강아지 아이디
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
router.post("/report", convertFood);


//사료 로그 마감
/**
 * @swagger
 * /food/report:
 *   patch:
 *     tags:
 *       - FOOD
 *     summary: 사료 마감 기능 
 *     description: 기존 사료 로그를 마감처리합니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pet_id
 *         required: true
 *         description: 강아지 순서 (1, 2, 3 ...)
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 사료 변경 성공
 *       401:
 *         description: 인증 실패 - JWT 토큰이 유효하지 않음
 *       400:
 *         description: 잘못된 요청 - 필수 파라미터 누락 또는 형식 오류
 */
router.patch("/report", endFeedReport);

// 사료 추가
/**
 * @swagger
 * /food/foods:
 *   post:
 *     tags:
 *       - FOOD
 *     summary: 사료 추가 기능 
 *     description: 기존 사료로그에서 동일한 사료를 추가합니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pet_id
 *         required: true
 *         description: pet_id
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: foodOrder
 *         required: true
 *         description: 사료 추가 갯수 
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 사료 변경 성공
 *       401:
 *         description: 인증 실패 - JWT 토큰이 유효하지 않음
 *       400:
 *         description: 잘못된 요청 - 필수 파라미터 누락 또는 형식 오류
 */
router.post("/foods", addFeedReport); 
export {router as FoodRouter }; 
import express from 'express';
import { getAllFood } from '../../controller/food.controller.js';

const router = express.Router();


router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

/** @swagger
 * tags:
 *   name: FOOD
 *   description: 사료 곳간 기능 관련 API 입니다.
 */

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
export {router as FoodRouter }; 
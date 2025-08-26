import express from "express";
const router = express.Router();  // 변수명 동일해도 상관 없음

// controllers
import { getMyDogs } from '../../controller/v2/dog.controller.js';

// middle - ware.js
import { authenticateUser } from "../../middleware/jwt.middleware.js";

/**
 * @swagger
 * tags:
 *   name: PET2
 *   description: "강아지 관련 API 모음입니다."
 */

router.use(authenticateUser);

/**
 * @swagger
 * /v2/dog/dogs:
 *   get:
 *     tags:
 *       - PET2
 *     summary: "마이페이지 강아지 조회 API"
 *     description: "사용자가 등록한 강아지 목록을 조회합니다."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "강아지 조회 성공"
 *       500:
 *         description: "서버 오류"
 */
router.get("/dogs", getMyDogs);

export { router as dogRouter };
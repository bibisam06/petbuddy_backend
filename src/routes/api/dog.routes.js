import express from 'express';
import {createDog, deleteGangG, findAllDogs} from '../../controller/dog.controller.js';
import { authenticateUser } from '../../middleware/jwt.middleware.js';
import { petMiddleware } from '../../middleware/dog.middleware.js';
const router = express.Router();


router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

/**
 * @swagger
 * tags:
 *   name: PET
 *   description: "강아지 관련 API 모음입니다."
 */

/**
 * @swagger
 * /dog/newdog:
 *   post:
 *     tags:
 *       - PET
 *     summary: "강아지 등록 API"
 *     description: "강아지 이름, 크기, 생일, 사료 정보 등을 등록합니다."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pet_name:
 *                 type: string
 *                 description: "강아지 이름"
 *               pet_size:
 *                 type: string
 *                 description: "강아지 크기 (예: 소형, 중형, 대형)"
 *               division2_code:
 *                 type: string
 *                 description: "견종 코드"
 *               pet_gender:
 *                 type: string
 *                 enum: [male, female]      # gender는 enum으로 제한하는게 좋아요
 *                 description: "성별 (male 또는 female)"
 *               neuter_yn:
 *                 type: boolean
 *                 description: "중성화 여부 (true 또는 false)"
 *               feed_id:
 *                 type: integer
 *                 description: "급여 중인 사료 ID"
 *               feed_time:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"  # 시간 형식 HH:mm 정규식 추가
 *                 description: "하루 중 사료 급여 시간 목록 (HH:mm 형식)"
 *               pet_birth:
 *                 type: string
 *                 format: date
 *                 description: "생년월일 (YYYY-MM-DD)"
 *             required:
 *               - pet_name
 *               - pet_size
 *               - division2_code
 *               - pet_gender
 *               - neuter_yn
 *               - feed_id
 *               - feed_time
 *               - pet_birth
 *             example:
 *               pet_name: "초코"
 *               pet_size: "소형"
 *               division2_code: "001001"
 *               pet_gender: "male"
 *               neuter_yn: true
 *               feed_id: 101
 *               feed_time: ["08:00", "18:00"]
 *               pet_birth: "2022-05-01"
 *     responses:
 *       201:
 *         description: "강아지 등록 성공"
 *       400:
 *         description: "요청 오류 (필수값 누락 등)"
 *       500:
 *         description: "서버 내부 오류"
 */
router.post("/newdog", petMiddleware, createDog);

/**
 * @swagger
 * /dog/dogs:
 *   get:
 *     tags:
 *       - PET
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
router.get("/dogs", authenticateUser, findAllDogs);

/**
 * @swagger
 * /dog/dogs:
 *   delete:
 *     tags:
 *       - PET
 *     summary: "강아지 삭제 API"
 *     description: "마이페이지에서 선택한 강아지 정보를 삭제합니다."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: dog
 *         in: query
 *         required: true
 *         description : 강아지 순서 1...2...3...
 *         schema:
 *           type: string
 *           example: ""
 *     responses:
 *       200:
 *         description: "강아지 삭제 성공"
 *       400:
 *         description: "요청 오류"
 *       500:
 *         description: "서버 오류"
 */
router.delete("/dogs", petMiddleware, deleteGangG);
export {router as dogRouter }; 

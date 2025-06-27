import express from 'express';
import {createDog, deleteGangG, findAllDogs, editGangG} from '../../controller/dog.controller.js';
import { authenticateUser } from '../../middleware/jwt.middleware.js';
import { petMiddleware , calculate_reamains} from '../../middleware/dog.middleware.js';
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
 *                 enum: [male, female]
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
 *                   pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 description: "하루 중 사료 급여 시간 목록 (HH:mm 형식)"
 *               pet_birth:
 *                 type: string
 *                 format: date
 *                 description: "생년월일 (YYYY-MM-DD)"
 *               food_remain_grade:
 *                 type: string
 *                 enum: [A, B, C]
 *                 description: "사료 남은 정도 (A: 넉넉, B: 보통, C: 부족)"
 *             required:
 *               - pet_name
 *               - pet_size
 *               - division2_code
 *               - pet_gender
 *               - neuter_yn
 *               - feed_id
 *               - feed_time
 *               - pet_birth
 *               - food_remain_grade
 *             example:
 *               pet_name: "초코"
 *               pet_size: "SMALL"
 *               division2_code: "A001001"
 *               pet_gender: "male"
 *               neuter_yn: true
 *               feed_id: 101
 *               feed_time: ["08:00", "18:00"]
 *               pet_birth: "2022-05-01"
 *               food_rmain_grade: "B"
 *     responses:
 *       201:
 *         description: "강아지 등록 성공"
 *       400:
 *         description: "요청 오류 (필수값 누락 등)"
 *       500:
 *         description: "서버 내부 오류"
 */
router.post("/newdog", petMiddleware, calculate_reamains, createDog);


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
 * /dog/update:
 *   patch:
 *     tags:
 *       - PET
 *     summary: "강아지 정보 수정 API 입니다."
 *     description: "강아지 이름, 크기, 생일, 사료 정보 등을 수정합니다."
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
 *               division2_code:
 *                 type: string
 *                 description: "견종 코드"
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
 *                   pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 description: "하루 중 사료 급여 시간 목록 (HH:mm 형식)"
 *               pet_birth:
 *                 type: string
 *                 format: date
 *                 description: "생년월일 (YYYY-MM-DD)"
 *               food_remain_grade:
 *                 type: string
 *                 enum: [A, B, C]
 *                 description: "사료 남은 정도 (A: 넉넉, B: 보통, C: 부족)"
 *             required:
 *               - pet_name
 *               - division2_code
 *               - neuter_yn
 *               - feed_id
 *               - feed_time
 *               - pet_birth
 *               - food_remain_grade
 *             example:
 *               pet_name: "초코"
 *               pet_size: "SMALL"
 *               division2_code: "A001001"
 *               pet_gender: "male"
 *               neuter_yn: true
 *               feed_id: 101
 *               feed_time: ["08:00", "18:00"]
 *               pet_birth: "2022-05-01"
 *               food_rmain_grade: "B"
 *     responses:
 *       201:
 *         description: "강아지 등록 성공"
 *       400:
 *         description: "요청 오류 (필수값 누락 등)"
 *       500:
 *         description: "서버 내부 오류"
 */
router.patch("/update",petMiddleware, editGangG);


/**
 * @swagger
 * /dog/delete:
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
router.delete("/delete", petMiddleware, deleteGangG);
export {router as dogRouter }; 
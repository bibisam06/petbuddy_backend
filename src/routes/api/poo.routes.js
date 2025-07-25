import express from 'express';
import { authenticateUser } from '../../middleware/jwt.middleware.js';
// middleware - multer S3
import { upload } from '../../util/S3upload.js';
import { deleteS3Folder } from '../../util/S3delete.js';

const router = express.Router();

//middleware
router.use(authenticateUser);

//controllers 
import { createPooLog, deletePooPictures, getDailyCode, getMonthlyCode, getMonthsMean } from '../../controller/poo.controller.js';

/** @swagger
 * tags:
 *   name: POO
 *   description: poo...
 */


/**
 * @swagger
 * /poo/upload:
 *   post:
 *     tags:
 *       - POO
 *     summary: 사진 업로드 기능
 *     description: S3에 이미지를 업로드하고, url을 반환하는 API 입니다.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일, 주석처리해둠 업로드 ㄷ
 *               pet_id:
 *                 type: integer
 *                 description: pet dog id
 *                 example: 11
 *               poop_score_total:
 *                 type: integer
 *                 description: 총 점수 
 *                 example: 75
 *               poop_grade_total:
 *                 type: integer
 *                 description: 코드 점수 (1~17)
 *                 example: 3
 *               poop_score_moisture:
 *                 type: integer
 *                 description: 수분 점수
 *                 example: 79
 *               poop_grade_moisture:
 *                 type: string
 *                 description: 수분 등급 (A/B/C)
 *                 example: C
 *               poop_score_color:
 *                 type: integer
 *                 description: 색상 점수
 *                 example: 69
 *               poop_grade_color:
 *                 type: string
 *                 description: 색상 등급 (A/B/C)
 *                 example: B
 *               poop_score_parasite:
 *                 type: integer
 *                 description: 기생충 점수
 *                 example: 69
 *               poop_grade_parasite:
 *                 type: string
 *                 description: 기생충 등급 (A/B/C)
 *                 example: B
 *     responses:
 *       201:
 *         description: 이미지 업로드 및 분석 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 분석 결과가 성공적으로 저장되었습니다.
 *                 image_url:
 *                   type: string
 *                   example: https://s3.amazonaws.com/bucket-name/uploads/filename.jpg
 *       400:
 *         description: 잘못된 요청 (필수값 누락 또는 잘못된 형식)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: pet_id는 필수 입력입니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 이미지 업로드 중 오류가 발생했습니다.
 */
router.post("/upload" , upload.single('image'), createPooLog);

/**
 * @swagger
 * /poo/monthly-code:
 *   get:
 *     tags:
 *       - POO
 *     summary: 한달 상태 코드 반환 
 *     description: 한달간의 날짜와 상태코드 쌍을 반환합니다. - 완료  
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name : month
 *         required: true
 *         description : 예시 2025-07
 *       - in: query
 *         name: dog_id
 *         required : true
 *         description : 강아지 아이디
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.get("/monthly-code", getMonthlyCode);

/**
 * @swagger
 * /poo/monthly-mean:
 *   get:
 *     tags:
 *       - POO
 *     summary: 한달 평균 값 조회
 *     description: 한달간의 점수 평균값을 계산해 반환합니다..
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name : month
 *         required: true
 *         description : 예시 2025-07
 *       - in: query
 *         name: dog_id
 *         required : true
 *         description : 강아지 아이디
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.get("/monthly-mean", getMonthsMean);

/**
 * @swagger
 * /poo/daily-status:
 *   get:
 *     tags:
 *       - POO
 *     summary: 하루 상태 조회 
 *     description: 하루 상태 조회 기능입니다
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name : date
 *         required: true
 *         description : 예시 2025-07-05
 *       - in: query
 *         name: dog_id
 *         required : true
 *         description : 강아지 아이디
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.get("/daily-status", getDailyCode);


/**
 * @swagger
 * /poo/delete:
 *   delete:
 *     tags:
 *       - POO
 *     summary: 강아지 똥 삭제 테스트 용 API 입니다..
 *     description: 강아지 똥 사진 삭제 할 때 사용할 유틸 기능 테스트 용입니다...
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pet_id
 *         required: true
 *         description: 강아지 아이디
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.delete("/delete", deletePooPictures);


export { router as pooRouter };
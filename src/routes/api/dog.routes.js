// routes/dog.routes.js
import express from 'express';
import { createDog, deleteGangG, findAllDogs } from '../../controller/dog.controller.js';
import { petMiddleware } from '../../middleware/dog.middleware.js';
import { authenticateUser } from '../../middleware/jwt.middleware.js';
const router = express.Router();


router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * /dog/newdog:
 *   post:
 *     tags:
 *       - PET
 *     summary: 강아지 등록 API
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
 *               pet_size:
 *                 type: string
 *               division2_code:
 *                 type: string
 *               pet_gender:
 *                 type: string
 *               neuter_yn:
 *                 type: boolean
 *                 description : 중성화 여부 : true or false.. 
 *               feed_id:
 *                 type: int
 *               feed_time: 
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "08:00"
 *               pet_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: 강아지 등록 성공
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
router.post("/newdog",petMiddleware , createDog);

/**
 * @swagger
 * /dog/dogs:
 *   get:
 *     tags:
 *       - PET
 *     summary: 마이페이지 강아지 조회 API입니다. 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 강아지 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/dogs", authenticateUser, findAllDogs);


router.delete("/dogs", authenticateUser, deleteGangG);
export { router as dogRouter };


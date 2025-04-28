import express from 'express';
import DogController from '../../controller/DogController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PET
 *   description: 강아지 관련 API 모음입니다.
 */

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
 *     description: 새로운 강아지 정보를 등록하는 API입니다.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pet_name:
 *                 type: string
 *                 description: 강아지 이름
 *               pet_size:
 *                 type: string
 *                 description: 강아지 크기 (LARGE, MEDIUM, SMALL)
 *               pet_division_2_code:
 *                 type: string
 *                 description: 강아지 품종
 *               pet_gender:
 *                 type: string
 *                 description: 성별 (MALE, FEMALE)
 *               neuter_yn:
 *                 type: boolean
 *                 description: 중성화 여부
 *               pet_birth:
 *                 type: string
 *                 description: 생년월일 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 강아지 등록 성공
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
router.post("/newdog", async (req, res) => {
    try {
        const { pet_name, pet_size, pet_division_2_code, pet_gender, neuter_yn, pet_birth } = req.body;
        const dogData = { pet_name, pet_size, pet_division_2_code, pet_gender, neuter_yn, pet_birth };

        const newDog = await DogController.createDog(dogData); // createDog 결과를 받아야 함

        res.status(201).json({ message: "Dog created successfully", dog: newDog });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /dog/dogs:
 *   get:
 *     tags:
 *       - PET
 *     summary: 강아지 조회 API
 *     description: 등록된 강아지 정보를 조회하는 API입니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 강아지 조회 성공
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
router.get("/dogs", async (req, res) => {
    try {
        const newUser = req.user; 
        const userEmail = newUser.email;
        const dogData = await DogController.findDogs(newUser.id); // user.id → newUser.id 수정

        return res.status(200).json({
            email: userEmail,
            dogData
        });
    } catch (error) { // error를 받아야 함
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export { router as dogRouter };


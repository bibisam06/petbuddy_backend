import express from 'express';
//import { body } from 'express-validator';

const router = express.Router();
const app = express();
app.use(express.json());

import DogController from '../../controller/DogController.js';
/**
 * @swagger
 * tags:
 *   name: PET
 *   description: 강아지 관련 API 모음입니다.
 */



/**
 * @swagger
 * /dog/newdog:
 *   post:
 *     tags:
 *       - PET
 *     summary: 강아지등록 API
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
 *                 description: 강아지 크기 ENUM('LARGE', 'MEDIUM', 'SMALL');
 *               pet_division_2_code:
 *                 type: string
 *                 description: 강아지 품종 - 아직 enum 없음음
 *               pet_gender:
 *                 type: string
 *                 description: 성별 - ENUM('MALE', 'FEMALE');
 *               neuter_yn:
 *                 type: boolean
 *                 description: 강아지 중성화 여부 true/false
//  *               pet_feed:
//  *                 type: string
//  *                 description: 급여 중인 사료 -> 사료 DB 정리 아직안됨 
//  *               pet_feed_time:
//  *                 type: string
//  *                 description: 사료 급여 시간 -> 이것도 
//  *              pet_feed_left:
//  *                 type: string
//  *                 description: 사료 남은 양 .. 
 *                 pet_birth:
 *                 type: string
 *                 description: 생년월일(YYYY-MM-DD형식)
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.post("/newdog", async(req, res) => {
    try{
        const { pet_name, pet_size, pet_division_2_code, pet_gender, neuter_yn, pet_birth} = req.body;
        const dogData = {
            pet_name, pet_size, pet_division_2_code, pet_gender, neuter_yn, pet_birth
        };

        DogController.createDog(dogData);

        //const newuser = req.user;
        res.status(201).json({ message: "Dog created successfully", dog: newDog });
        
    }catch(error){
        console.error("Error occured!:", error.message);
        res.status(403).json({ message: "Error occured" });
    }
});
export { router as dogRouter };


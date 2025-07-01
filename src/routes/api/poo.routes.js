import express, { response } from 'express';

//models 
import PooAnalysis from '../../models/poo.log.model.js';

// middleware 
import upload from '../../config/aws-config.js';
import { sendResponse } from '../../util/response.util.js';
import { NoFileDetectedError } from '../../error/error.handler.js';
const router = express.Router();

/** @swagger
 * tags:
 *   name: POO
 *   description: poo...
 */

router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});



/**
 * @swagger
 * /poo/upload:
 *   post:
 *     tags:
 *       - POO
 *     summary: 사진 업로드 기능
 *     description: S3에 이미지를 업로드하고, 사용자 정보(email, password)를 함께 받는 기능입니다.
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
 *                 description: 업로드할 이미지 파일
 *               poop_score_total:
 *                 type: integer
 *                 description: 총 점수 
 *                 example: 75
 *               poop_score_grade:
 *                 type: integer
 *                 description: 코드 점수 1에서 5까지
 *                 example: 3
 *               poop_score_moisture:
 *                 type: string
 *                 description: moisture
 *                 example: A
 *               poop_score_color:
 *                 type: string
 *                 description: B
 *                 example: C
 *               poop_score_parasite:
 *                 type: string
 *                 description: C
 *                 example: B
 */
router.post("/upload", upload.single('image'), async (req, res, next) => {
try{

    if(!req.file){
        throw new NoFileDetectedError();
    }

    console.log(req.file); 

    // TODO : req.file {
    // key(uploads/...), location, etage  
    //}

    // TODO : Database create (**)
    const result = await PooAnalysis.create({
        poop_date : Date.now(),
        
    });
    return sendResponse(res, {
        responseCode : 200,
        responseMessage : "사진을 업로드했습니다.",
        data : req.file.location
    })
}catch(error){
    console.error(error.message);
    next(error);
}
});


export { router as pooRouter };
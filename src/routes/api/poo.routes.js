import express from 'express';

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
    *     description: 아직 구현 안된 기능입니다.
    *     produces:
    *       - application/json
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 description: 이메일 - (아이디)
    *                 example : h@naver.com
    *               password:
    *                 type: string
    *                 example : string
    *                 description: 패스워드
    *               
    *     responses:
    *       200:
    *         description: user logged in successfully
    *       400: 
    *         description: Wrong Email
    *       500: 
    *         description: Error occurred!
    */ 
router.post("/upload", (req, res, next) => {
try{

}catch(error){
    console.error("ddddd");
    next(error);
}
});


export { router as pooRouter };
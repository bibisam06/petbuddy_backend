import express from 'express';

const router = express.Router();

//controllers, middlewares
import { getDashBoard } from '../../controller/dash.controller.js';
import { petMiddleware } from '../../middleware/dog.middleware.js';

router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


/**
 * @swagger
 * tags:
 *   name: HOME
 *   description: 메인 대시보드 관련 API 입니다.
 */



/**
 * @swagger
 * /home/dash-board:
 *   get:
 *     tags:
 *       - HOME
 *     summary: 메인 화면 API 
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
 *         description: 대시보드 정보 호출 완료
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
router.get("/dash-board", petMiddleware ,getDashBoard);

export { router as homeRouter };

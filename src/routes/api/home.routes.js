import express from 'express';

const router = express.Router();

//controllers, middlewares
import { getDashBoard } from '../../controller/dash.controller.js';
import { petMiddleware } from '../../middleware/dog.middleware.js';

router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

//TODO : 강아지 조회할때, 강아지 번호로 조회할 수 있게? -> 사용자 별로 첫번쨰, 두번째, 세번째 이런식으로 
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
 *         description : 강아지 순서
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

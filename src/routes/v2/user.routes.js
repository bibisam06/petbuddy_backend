// default import 
import express from "express";

// middle - ware.js
import { authenticateUser } from "../../middleware/jwt.middleware.js";

//controllers 
import { getMyPageData } from "../../controller/v2/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AUTH2
 *   description: 로그인/로그아웃, 마이페이지 등 
 */

/**
 * @swagger
 * tags:
 *   name: USER2
 *   description: 회원 정보 관련 API
 */

/**
 * @swagger
 * /v2/user/mypage:
 *   get:
 *     tags:
 *       - USER2
 *     summary: 마이페이지
 *     description: 마이페이지 - 사용자정보확인API입니다.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   
 *     responses:
 *       200:
 *         description: user information updated successfully!!
 *       400:
 *         description: Wrong Email
 *       500:
 *         description: Error occurred!
 */
router.get("/mypage", authenticateUser, getMyPageData)



export { router as userRouter }; 
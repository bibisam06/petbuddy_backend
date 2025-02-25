import express from "express";
const router = express.Router();

/**
 * @swagger
 * /kakao/token:
 *   post:
 *     tags:
 *       - KAKAO Auth
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: fcmToken
 *       in: header
 *       description: fire base cloud messaging token
 *       required: true
 *       type: string
 *     - name: platform
 *       in: header
 *       description: the platform that the user is using to access the system ios/android
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       description: the login credentials
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *           password:
 *             type: string
 *     responses:
 *       200:
 *         description: user logged in successfully
 */
router.post("/kakao/token", async (req, res) => {
    const { code } = req.query;
    // 로그인 로직
});

/**
 * @swagger
 * /kakao/code:
 *   get:
 *     tags:
 *       - KAKAO Auth
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: code
 *       in: query
 *       description: Authorization code from Kakao
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Kakao code received successfully
 */
router.get("/kakao/code", async (req, res) => {
    const { code } = req.query;
    // Kakao 코드 처리 로직
});

export { router as authRouter };

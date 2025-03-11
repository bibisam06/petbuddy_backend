import express from 'express';
import AuthController from '../../controller/AuthController.js';
//import User from "../../models/user.model.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: 로그인/로그아웃
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - AUTH
 *     summary: 로그인
 *     description: 발급받은 JWT 토큰을 통해 로그인하는 API입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jwt_token  # Use underscore for consistency
 *         in: header  # Use header instead of headers
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       400:
 *         description: Bad Request - Invalid login type
 */
router.get("/login", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

    try{
        if (await TokenBlacklist.isBlacklisted(token)) { //blacklist확인
            return res.status(401).json({ error: 'Token is blacklisted' });
        }
        const userInfo = jwt.verify(token, process.env.JWT_SECRET); 
        res.status(200).json({ message: "Token is valid", user: userInfo.id });
    }
    catch{
        res.status(400).json({message : "Invalid Token Error!"});
    }
});

/**
 * @swagger
 * /user/signout:
 *   post:
 *     tags:
 *       - AUTH
 *     summary: 회원 탈퇴
 *     description: 발급받은 JWT 토큰을 통해 로그인하는 API입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jwt_token  # Use underscore for consistency
 *         in: header  # Use header instead of headers
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.post("/signout", async (req, res)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await User.destroy({ where: { id: userId } });

        res.status(200).json({ message: "User account deleted successfully." });
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
})



/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags:
 *       - AUTH
 *     summary: 로그아웃
 *     description: 로그아웃 시 리프레시토큰을 삭제하고, 블랙리스트에 등록합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: refresh_token
 *         in: body
 *         description: refresh token삭제..
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User refresh deleted successfully.
 *       401:
 *         description: Invalid token.
 */
router.post("/logout", async (req, res)=>{
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    try {
        await AuthController.deleteRefreshToken(refreshToken);
        await TokenBlacklist.addToBlacklist(refreshToken);
        return res.status(200).json({message : "User refresh deleted successfully."})
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
})

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     tags:
 *       - AUTH
 *     summary: 리프레쉬 토큰 재 발급
 *     description: 토큰 만료 시, 액세스토큰을 재 발급해주는 api입니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: refresh_token
 *         in: header  # Use header instead of headers
 *         description: JWT 토큰
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *       401:
 *         description: Unauthorized!
 *      403:
 *          description: Invalid refresh token
 */
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    // 리프레시 토큰이 제공되지 않거나 블랙리스트에 있는 경우 처리
    if (!refreshToken || await TokenBlacklist.isBlacklisted(refreshToken)) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    try {
        // 리프레시 토큰 검증
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // 새로운 액세스 토큰 발급
        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // 새로운 리프레시 토큰 저장
        const newRefreshToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );

        await AuthController.saveRefreshToken(payload.userId, newRefreshToken);

        // 응답 반환
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Refresh token verification error:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
});



export { router as userRouter };


import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /user/login:
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
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       400:
 *         description: Bad Request - Invalid login type
 */
router.get("/login", async (req, res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

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
router.get("/signout", async (req, res)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await User.destroy({ where: { id: userId } });

        res.status(200).json({ message: "User account deleted successfully." });
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
})

export { router as userRouter };



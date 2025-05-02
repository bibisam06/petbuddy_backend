import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CAT
 *   description: 고양이 관련 API 모음입니다.
 */

router.get("/cat", (req, res)=>{
    res.send("기능 개발 중입니다...!");
});
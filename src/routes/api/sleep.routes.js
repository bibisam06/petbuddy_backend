import express from 'express';

const router = express.Router();

// import controller
import { getDailySleepStatus } from '../../controller/sleep.controller.js';
/**
 * @swagger
 * tags:
 *   name: SLEEP
 *   description: "sleep log 관련 API 모음입니다."
 */


router.get("/monthly-status");

export { router as sleepRouter };
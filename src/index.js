import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import helmet from 'helmet';
import fs from 'fs';

//router imports 
import { authRouter } from './routes/api/auth.routes.js';
import { dogRouter } from './routes/api/dog.routes.js';
import { homeRouter } from "./routes/api/home.routes.js";
import { userRouter } from './routes/api/user.routes.js';
import { wedRouter } from "./routes/api/weather.routes.js";
import { FoodRouter } from "./routes/api/food.routes.js";
import { errorHandler } from './middleware/error/error.middleware.js';
import { pooRouter } from "./routes/api/poo.routes.js";
import { activityRouter } from "./routes/api/activity.routes.js";
import { barkRouter } from "./routes/api/barks.routes.js";
import { sleepRouter } from "./routes/api/sleep.routes.js";

// v2 routes 
import { dogRouter as dogRouterV2 } from './routes/v2/dog.routes.js'; 
import { userRouter as userRouterV2 } from "./routes/v2/user.routes.js";
// logger.js
import { fileLogger, devLogger } from '../src/util/morganLogger.js';

//scheduler
import { scheduleAllUsers } from "./scheduler/feed.scheduler.js";

//server - settings
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
const app = express();
const PORT = 3000;

//swagger - middleware
import { specs, swaggerUi } from './config/swagger.js';
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

// cors 
app.set('trust proxy', true);
app.use(cors({
    origin: '*', 
    credentials: true
    }));

// json - default 
app.use(express.json());

//logger - morgan

// 📄 logs 디렉토리 없으면 생성
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

app.use(devLogger);
app.use(fileLogger);

// 보안 모듈 - helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // 처음에는 CSP는 꺼두고 천천히 구성해나갈 생각
    crossOriginEmbedderPolicy: false,
  })
);

// /favicon.ico 경로 요청 거절
app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    // 204: No Content
    return res.status(204).end();
  }
  next();
});



// 서버 실행
app.listen(PORT, '0.0.0.0', () => {
  //logger.info(`🚀 서버 실행 중: http://localhost:${PORT}`);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


//middlewares 
scheduleAllUsers(); // 앱 시작 시 스케줄러 등록 - 테스트 예정

app.use((req, res, next) => {
  const timestamp = Date.now();
  console.log(`[${timestamp}] : [${req.method}] ${req.originalUrl}`);
  next();
});


//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/auth', authRouter);
app.use('/weather', wedRouter);
app.use('/home', homeRouter);
app.use('/food', FoodRouter)
app.use('/poo', pooRouter);
app.use('/activity', activityRouter);
app.use('/bark', barkRouter);
app.use('/sleep', sleepRouter);

//v2 routes
app.use("/v2/dog", dogRouterV2);
app.use("/v2/user", userRouterV2)


// middle-ware.js
app.use(errorHandler);


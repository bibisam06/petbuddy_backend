import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import { authRouter } from './routes/api/auth.routes.js';
import { dogRouter } from './routes/api/dog.routes.js';
import { homeRouter } from "./routes/api/home.routes.js";
import { userRouter } from './routes/api/user.routes.js';
import { wedRouter } from "./routes/api/weather.routes.js";
import { FoodRouter } from "./routes/api/food.routes.js";
import { errorHandler } from './middleware/error.middleware.js';
import { pooRouter } from "./routes/api/poo.routes.js";
import { activityRouter } from "./routes/api/activity.routes.js";

import { scheduleAllUsers } from "./scheduler/feed.scheduler.js";
//server
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
const app = express();
const PORT = 3000;

//swagger - middleware
import { specs, swaggerUi } from './config/swagger.js';
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.set('trust proxy', true);
app.use(cors({
    origin: '*', 
    credentials: true
    }));

app.use(express.json());


scheduleAllUsers(); // 앱 시작 시 스케줄러 등록
// 서버 실행
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
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



// middle-ware.js
app.use(errorHandler);
import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import sequelize from './db/pgConnect.js';
import { authRouter } from './routes/api/auth.routes.js';
import { dogRouter } from './routes/api/dog.routes.js';
import { homeRouter } from "./routes/api/home.routes.js";
import { userRouter } from './routes/api/user.routes.js';
import { wedRouter } from "./routes/api/weather.routes.js";
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

//TODO : 일단 서버 재구성하기전에 주석쳐두고 나중에 수정할예정입니다.!!
// //sync db 
// sequelize.sync({ alter: true }) // 개발 환경에서만 sequelize - sync(alter -> true) 로 사용하고 production 에서는 변경할 예정입니다. 
//   .then(() => {
//     console.log('✅ DB synced successfully');
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to sync DB:', err);
//   });

        
//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/auth', authRouter);
app.use('/weather', wedRouter);
app.use('/home', homeRouter);


app.get('/', (req, res)=> {
   res.send("Hello");
})

//test용 미들웨어 
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});
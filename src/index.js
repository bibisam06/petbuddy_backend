import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import sequelize from './db/pgConnect.js';
import { authRouter } from './routes/api/auth.js';
import { dogRouter } from './routes/api/dog.js';
import { userRouter } from './routes/api/user.js';
import { wedRouter } from "./routes/api/weather.js";
//server
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
const app = express();
const PORT = 3000;

//swagger - middleware
import { specs, swaggerUi } from './config/swagger.js';
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
    origin: '*', 
    credentials: true
  }));
  

app.use(express.json());


//sync db
sequelize.sync({ alter: true }) // 개발 환경에서만 sequelize - sync(alter -> true) 로 사용하고 production 에서는 변경할 예정입니다. 
  .then(() => {
    console.log('✅ DB synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync DB:', err);
  });

        
//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/auth', authRouter);
app.use('/weather', wedRouter);


app.get('/', (req, res)=> {
    res.send("Hello");
})
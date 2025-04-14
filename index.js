import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import { authRouter } from './src/routes/api/auth.js';
import { dogRouter } from './src/routes/api/dog.js';
import { userRouter } from './src/routes/api/user.js';

//server

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const port = 3000;

//swagger - middleware
import { specs, swaggerUi } from './src/config/swagger.js';
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
    origin: '*', // 또는 'http://localhost:3000' 등
    credentials: true
  }));
  
app.use(express.json());

// //Sequelize - configuration 
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
app.listen(port, () => {
          console.log(`🚀 Server is running on http://localhost:port`);
        });

        
//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/auth', authRouter);


app.get('/hello', (req, res) => {
    res.send('Task Manager app');
});

app.get('/', (req, res)=> {
    res.send("Hello");
})
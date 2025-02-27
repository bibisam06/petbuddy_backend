import dotenv from "dotenv";
import express from 'express';

import { authRouter } from './src/routes/api/auth.js';
import { dogRouter } from './src/routes/api/dog.js';
import { userRouter } from './src/routes/api/user.js';

//server
dotenv.config();
const app = express();
const port = 3000;

//swagger - middleware
import { specs, swaggerUi } from './src/config/swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


//DynamoDB
import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB();


//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log('Current File:', import.meta.url);
    console.log('Current Directory:', new URL('.', import.meta.url).pathname);
    console.log('Server is running');
});

app.get('/hello', (req, res) => {
    res.send('Task Manager app');
});

app.get('/', (req, res)=> {
    res.send("Hello");
})
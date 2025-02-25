import express from 'express';
import path from 'path';
import { dogRouter } from './routes/dog.js';
import { userRouter } from './routes/user.js';
//DynamoDB
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB();

//server
const __dirname = path.resolve();
const app = express();
const port = 3000;

//routes..
app.use('/user', userRouter);
app.use('/dog', dogRouter);

app.listen(port, () => {
    console.log('Server is running');
});

app.get('/hello', (req, res) => {
    res.send('Task Manager app');
});

app.get('/', (req, res)=> {
    res.send("Hello");
})
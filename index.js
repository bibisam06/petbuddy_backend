import express from 'express';
import path from 'path';
import { dogRouter } from './src/routes/dog.js';
import { userRouter } from './src/routes/user.js';


//server
const __dirname = path.resolve();
const app = express();
const port = 3000;

//swagger
import { specs, swaggerUi } from './src/config/swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//DynamoDB
import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB();


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
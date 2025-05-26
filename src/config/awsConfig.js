import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const tableName = 'User';

const key = {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'ap-northeast-2'
};

AWS.config.update(key);
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const put = {
    TableName: tableName,
    Item: {
        user_id: 'idx001', 
        profile: 'data1'
    }
};

const insertData = async () => {
    try {
        const result = await dynamoDB.put(put).promise();
        console.log('데이터 추가 성공:', result);
    } catch (error) {
        console.error('데이터 추가 실패:', error);
    }
};

insertData();

//dotenv
import dotenv from 'dotenv';
dotenv.config();
//postgres
import { Pool } from 'pg';

const pool = new Pool({
    host: 'petbuddy-db.cdwwumouatbw.ap-northeast-2.rds.amazonaws.com',
    port: '5432',
    user: '',
    password: '',
    database: '',
    ssl: {
        rejectUnauthorized: false, // AWS RDS의 기본 인증서 사용 시 필요
    },
    max: 20, // 최대 클라이언트 수
    idleTimeoutMillis: 30000, // 사용되지 않는 연결을 풀에서 제거하는 시간 (ms)
    connectionTimeoutMillis: 2000, // 연결을 생성하는 데 걸리는 최대 시간 (ms)
});

// 연결을 가져오기 위한 함수
const getConnection = async () => {
    try {
        const client = await pool.connect(); // 풀에서 연결을 가져옴
        console.log('Database connected successfully');
        return client;
    } catch (err) {
        console.error('Database connection error:', err.stack);
        throw err;
    }
};

// 연결을 반납하는 함수
const closeConnection = (client) => {
    try {
        client.release(); // 연결을 풀에 반납
        console.log('Database connection released back to pool');
    } catch (err) {
        console.error('Error releasing database connection:', err.stack);
    }
};

module.exports = {
    getConnection,
    closeConnection,
};
출처: https://pooreumjung.tistory.com/510 [푸으름:티스토리]
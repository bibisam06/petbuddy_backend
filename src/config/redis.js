import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('🔥 Redis Connectedd!');
}

connectRedis();

export default redisClient;

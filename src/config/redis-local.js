import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('🔥 Redis Connectedd!');
}

connectRedis();

export default redisClient;

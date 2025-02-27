//dotenv
import dotenv from 'dotenv';
dotenv.config();
//postgres
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, 
    },
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
});


const getConnection = async () => {
    try {
        const client = await pool.connect(); 
        console.log('Database connected successfully');
        return client;
    } catch (err) {
        console.error('Database connection error:', err.stack);
        throw err;
    }
};


const closeConnection = (client) => {
    try {
        client.release(); 
        console.log('Database connection released back to pool');
    } catch (err) {
        console.error('Error releasing database connection:', err.stack);
    }
};

module.exports = {
    getConnection,
    closeConnection,
};
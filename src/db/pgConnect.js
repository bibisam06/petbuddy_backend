//dotenv
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
dotenv.config();

// Sequelize 연결 설정
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: false, // 쿼리 로그 출력 여부 (true로 설정하면 SQL 쿼리 출력됨)
  }
);

// 연결 상태 확인
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

export default sequelize;

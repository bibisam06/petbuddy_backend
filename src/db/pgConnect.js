//dotenv
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

// Sequelize 연결 설정
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // SSL 연결 사용
        rejectUnauthorized: false, // 자체 서명된 인증서 허용 (개발 환경에서만 사용 권장)
      },
    },
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

import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';

dotenv.config();

// 현재 파일 기준 절대 경로 계산
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 루트 디렉토리 기준 경로 설정
const rootPath = path.resolve(__dirname, '../..'); // 즉, 프로젝트 루트
const apiPath = process.env.NODE_ENV === 'production'
  ? path.join(rootPath, 'dist/routes/api/*.routes.js')
  : path.join(rootPath, 'src/routes/api/*.routes.js');


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: 'Pet Buddy - API',
      version: '1.0.0',
      description: '펫버디 백엔드 Api 문서입니다.',
    },
    servers: [
    {
      url: 'https://backend.pawprint.ai.kr', 
    },{
      description : "local testing url",
      url : "http://localhost:3000"
    }
  ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [apiPath],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };


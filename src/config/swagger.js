import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: 'Pet Buddy - API',
      version: '1.0.0',
      description: '펫버디 백엔드 Api 문서입니다.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [process.env.SWAGGER_APIS],  // <-- 여기가 포인트
};

const specs = swaggerJsdoc(options);
export { specs, swaggerUi };


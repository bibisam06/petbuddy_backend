import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
  apis: ['src/routes/api/*.js'], // JSDoc 주석이 있는 파일 경로
};

const specs = swaggerJsdoc(options);
export { specs, swaggerUi };


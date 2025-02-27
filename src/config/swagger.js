
import swaggereJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    swaggerDefinition: {
        routePrefix: "/swagger",
        info: {
            title: 'Pet Buddy - API',
            version: '1.0.0',
            description: '펫버디 백엔드 Api 문서입니다.',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['src/routes/api/*.js'],
};

// Swagger JSDoc 스펙을 생성합니다.
const specs = swaggereJsdoc(options);

// specs와 swaggerUi를 내보냅니다.
export { specs, swaggerUi };

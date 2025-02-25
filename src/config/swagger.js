import { dirname, join } from 'path'; // 수정: join을 가져옵니다.
import swaggereJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';

// 현재 파일의 경로를 가져옵니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // dirname을 사용하여 디렉토리 경로를 가져옵니다.

// API 경로를 설정합니다.
const apiPaths = join(__dirname, '../src/routes/api/*.js'); // 수정: path.join을 join으로 변경합니다.

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

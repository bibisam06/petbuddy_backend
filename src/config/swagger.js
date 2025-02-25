import swaggereJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    swaggerDefinition: {
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./routes/*.js', './swagger/*'],
};

const specs = swaggereJsdoc(options);

export { specs, swaggerUi };


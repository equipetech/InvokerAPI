import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InvokerAPI',
      version: '1.0.0',
      description: 'API documentation for InvokerAPI',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            nome: {
              type: 'string',
              nullable: true, 
            },
            email: {
              type: 'string',
              format: 'email',
            },
            senha_hash: {
              type: 'string',
            },
            biografia: {
              type: 'string',
              nullable: true,
            },
            localizacao: {
              type: 'string',
              nullable: true,
            },
            avatar_url: {
              type: 'string',
              nullable: true,
            },
            criado_em: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
          required: ['email', 'senha_hash'], 
        },
      },
    },
  },
  apis: ['./src/interface/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

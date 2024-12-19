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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            nome: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            telefone: {
              type: 'string',
            },
            localizacao: {
              type: 'string',
            },
          },
          example: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            nome: "John Doe",
            email: "user@example.com",
            telefone: "(11) 98765-4321",
            localizacao: "São Paulo, SP",
          },
        },
      },
    },
  },
  apis: ['./src/interface/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

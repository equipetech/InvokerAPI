import express from 'express';
import userRoutes from './interface/routes/userRoutes';
import 'reflect-metadata';
import { setupSwagger } from './swagger';
import { AppDataSource } from './ormconfig';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Configurar Middleware para CORS
app.use(cors());

// Configurar Middleware para JSON
app.use(express.json());

// Configurar Swagger
setupSwagger(app);

// Registrar as rotas com o prefixo /api
// Registrar as rotas com o prefixo /api
app.use('/api', userRoutes);
// Inicializar o DataSource e iniciar o servidor
app.get('/', (req, res) => {
  res.send('API is running!');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source initialized successfully');

    // Iniciar o servidor após a inicialização do banco de dados
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://98.85.165.251:${PORT}`);
      console.log(`Swagger docs available at http://98.85.165.251:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error initializing Data Source:', error);
  });
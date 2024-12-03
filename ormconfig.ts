import { DataSource } from 'typeorm';
import { UserEntity } from './src/infrastructure/database/entities/userEntity';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', // Host do banco de dados
  port: parseInt(process.env.DB_PORT || '5432'), // Porta do banco de dados
  username: process.env.DB_USERNAME || 'postgres', // Usuário do banco de dados
  password: process.env.DB_PASSWORD || 'password', // Senha do banco de dados
  database: process.env.DB_NAME || 'invokerapi', // Nome do banco de dados
  synchronize: false, // Não usar `synchronize` em produção para evitar perda de dados
  logging: true, // Exibe queries e erros no console para debugging
  entities: [UserEntity], // Entidades do TypeORM
  migrations: ['src/migration/*.ts'], // Caminho para migrações
  subscribers: [], // Inscritos (subscribers), se houver algum
  ssl: {
    rejectUnauthorized: true, // Garante que a conexão seja segura
  },
});

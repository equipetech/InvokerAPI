import { DataSource } from 'typeorm';
import { UserEntity } from './infrastructure/database/entities/userEntity';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'invokerapi',
  synchronize: false,
  logging: true,
  entities: ['dist/infrastructure/database/entities/*.js'], // Caminho correto para o arquivo
  migrations: ['dist/migration/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
});







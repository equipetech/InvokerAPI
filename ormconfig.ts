import { DataSource } from 'typeorm';
import { UserEntity } from './src/infrastructure/database/entities/userEntity';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Desative synchronize para usar migrações
  logging: true,
  entities: [UserEntity],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});
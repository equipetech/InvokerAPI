import { Client } from 'pg';

const createDatabaseIfNotExists = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres', 
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database "${process.env.DB_NAME}" created successfully!`);
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('Error creating database', err);
  } finally {
    await client.end();
  }
};

const createTableIfNotExists = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        biografia TEXT,
        localizacao POINT,
        avatar_url VARCHAR(255),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "usuarios" created successfully!');
  } catch (err) {
    console.error('Error creating table', err);
  } finally {
    await client.end();
  }
};

(async () => {
  await createDatabaseIfNotExists();
  await createTableIfNotExists();
})();

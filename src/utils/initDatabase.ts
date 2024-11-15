import { Client } from 'pg';
import 'dotenv/config'; 

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
    console.log('Conectado ao banco de dados padrão "postgres".');

    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Banco de dados "${process.env.DB_NAME}" criado com sucesso!`);
    } else {
      console.log(`Banco de dados "${process.env.DB_NAME}" já existe.`);
    }
  } catch (err) {
    console.error('Erro ao criar banco de dados', err);
  } finally {
    await client.end();
  }
};

createDatabaseIfNotExists();

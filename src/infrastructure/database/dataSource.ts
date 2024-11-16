import { Client } from 'pg';
import { createTableIfNotExists } from './tables/userTable';

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

(async () => {
  await createDatabaseIfNotExists();
  await createTableIfNotExists();
})();
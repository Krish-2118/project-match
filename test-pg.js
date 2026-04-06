/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_BiL4tGqnwv7s@ep-royal-bread-ahxdn0tu.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('Connecting to PostgreSQL directly with pg...');
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
    console.error('Error stack:', err.stack);
  } finally {
    await client.end();
  }
}

testConnection();

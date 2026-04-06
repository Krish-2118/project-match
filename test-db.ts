import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Connection successful:', result);
  } catch (error) {
    console.error('Connection failed:', error);
    if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

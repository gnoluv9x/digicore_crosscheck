import express, { Application } from 'express';
import logger from '@/lib/logger';
import Server from '@/index';
import prisma from '@/lib/prisma';

const app: Application = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server: Server = new Server(app);
const PORT: number = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 8000;

// override console.* function
console.log = (...args: any[]) => logger.info.call(logger, args);
console.info = (...args) => logger.info.call(logger, args);
console.warn = (...args) => logger.warn.call(logger, args);
console.error = (...args) => logger.error.call(logger, args);
console.debug = (...args) => logger.debug.call(logger, args);

app
  .listen(PORT, async () => {
    await prisma.$connect();
    console.log('Connected to database');
    console.log(`Server is running on port ${PORT}`);
  })
  .on('error', async (err: any) => {
    await prisma.$disconnect();
    console.log('Debug_here err: ', err);
    console.log(`Can not connect to database`);
  });

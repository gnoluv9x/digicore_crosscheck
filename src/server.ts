import express, { Application } from 'express';
import logger from '@/lib/logger';
import Server from '@/index';

const app: Application = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// override console.* function
console.log = (...args: any[]) => logger.info.call(logger, args);
console.info = (...args) => logger.info.call(logger, args);
console.warn = (...args) => logger.warn.call(logger, args);
console.error = (...args) => logger.error.call(logger, args);
console.debug = (...args) => logger.debug.call(logger, args);

app
  .listen(PORT, function () {
    console.log(`Server is running on port ${PORT} and http://localhost:${PORT}`);
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Error: address already in use');
    } else {
      console.log(err);
    }
  });

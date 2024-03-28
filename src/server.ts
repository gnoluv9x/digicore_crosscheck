import express, { Application } from 'express';
import Server from './index';

const app: Application = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

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

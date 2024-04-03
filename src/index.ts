import Routes from '@/routes';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@/docs/swagger.json';

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: '*',
    };

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}

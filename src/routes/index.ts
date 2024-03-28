import { Application } from 'express';
import tutorialRoutes from './tutorial.routes';
import transactionRoutes from './transaction.routes';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/tutorials', tutorialRoutes);
    app.use('/api/transactions', transactionRoutes);
  }
}

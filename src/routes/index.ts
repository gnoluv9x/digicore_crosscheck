import crosscheckRoutes from '@/routes/crosscheck.routes';
import transactionRoutes from '@/routes/transaction.routes';
import { Application } from 'express';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/crosscheck', crosscheckRoutes);
  }
}

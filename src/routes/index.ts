import AuthMiddleware from '@/middlewares/auth.middleware';
import crosscheckRoutes from '@/routes/crosscheck.routes';
import transactionRoutes from '@/routes/transaction.routes';
import { Application } from 'express';

export default class Routes {
  authMiddleWare!: AuthMiddleware;
  constructor(app: Application) {
    this.authMiddleWare = new AuthMiddleware();

    app.use(this.authMiddleWare.check);

    app.use('/api/transactions', transactionRoutes);
    app.use('/api/crosscheck', crosscheckRoutes);
  }
}

import TransactionController from '@/controllers/transaction.controller';
import SchemaValidatorMiddleware from '@/middlewares';
import { createTransactionSchema } from '@/validators/transaction.schema';
import { Router } from 'express';

class TransactionRoutes {
  router = Router();
  controller = new TransactionController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/', SchemaValidatorMiddleware.validate(createTransactionSchema), this.controller.create);

    this.router.get('/', this.controller.findAll);

    this.router.get('/:id', this.controller.findOne);

    this.router.put('/:id', this.controller.update);

    this.router.delete('/:id', this.controller.delete);

    this.router.delete('/', this.controller.deleteAll);
  }
}

export default new TransactionRoutes().router;

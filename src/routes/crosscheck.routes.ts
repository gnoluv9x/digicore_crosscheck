import CrosscheckController from '@/controllers/crosscheck.controller';
import ExcelMiddleware from '@/middlewares/excel.middleware.';
import { Router } from 'express';

class CrosscheckRoutes {
  router = Router();
  excelMiddleWare = new ExcelMiddleware();
  crosscheckController = new CrosscheckController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/', this.excelMiddleWare.handleUpload, this.crosscheckController.match);
    this.router.post('/create', this.crosscheckController.create);
  }
}

export default new CrosscheckRoutes().router;

import { Router } from 'express';
import TutorialController from '../controllers/tutorial.controller';
import ValidatorMiddleWare from '../middlewares';
import { tutorialSchema } from '../validators/tutorial.schema';
import ExcelMiddleware from '../middlewares/excel.middleware.';

class TutorialRoutes {
  router = Router();
  controller = new TutorialController();
  excelMiddleWare = new ExcelMiddleware();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Tutorial
    this.router.post('/', ValidatorMiddleWare.validate(tutorialSchema), this.controller.create);

    // Retrieve all Tutorials
    this.router.get('/', this.controller.findAll);

    // Retrieve all published Tutorials
    this.router.get('/published', this.controller.findAllPublished);

    // Retrieve a single Tutorial with id
    this.router.get('/:id', this.controller.findOne);

    // Update a Tutorial with id
    this.router.put('/:id', this.controller.update);

    // Delete a Tutorial with id
    this.router.delete('/:id', this.controller.delete);

    // Delete all Tutorials
    this.router.delete('/', this.controller.deleteAll);

    // test upload file
    this.router.post(
      '/upload',
      this.excelMiddleWare.handleUpload,
      this.excelMiddleWare.validateExcelFile,
      this.controller.uploadFile,
    );
  }
}

export default new TutorialRoutes().router;

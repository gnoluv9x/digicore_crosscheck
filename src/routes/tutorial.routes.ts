import TutorialController from '@/controllers/tutorial.controller';
import SchemaValidatorMiddleware from '@/middlewares';
import ExcelMiddleware from '@/middlewares/excel.middleware.';
import { tutorialSchema } from '@/validators/tutorial.schema';
import { Router } from 'express';

class TutorialRoutes {
  router = Router();
  controller = new TutorialController();
  excelMiddleWare = new ExcelMiddleware();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Tutorial
    this.router.post('/', SchemaValidatorMiddleware.validate(tutorialSchema), this.controller.create);

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
  }
}

export default new TutorialRoutes().router;

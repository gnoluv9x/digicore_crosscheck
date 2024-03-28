import { Router } from 'express';
import ValidatorMiddleWare from '../middlewares';
import { tutorialSchema } from '../validators/tutorial.schema';

class TransactionRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Tutorial
    this.router.post('/', ValidatorMiddleWare.validate(tutorialSchema));

    //   // Retrieve all Tutorials
    //   this.router.get('/', this.controller.findAll);

    //   // Retrieve all published Tutorials
    //   this.router.get('/published', this.controller.findAllPublished);

    //   // Retrieve a single Tutorial with id
    //   this.router.get('/:id', this.controller.findOne);

    //   // Update a Tutorial with id
    //   this.router.put('/:id', this.controller.update);

    //   // Delete a Tutorial with id
    //   this.router.delete('/:id', this.controller.delete);

    //   // Delete all Tutorials
    //   this.router.delete('/', this.controller.deleteAll);

    //   // test upload file
    //   this.router.post(
    //     '/upload',
    //     this.excelMiddleWare.handleUpload,
    //     this.excelMiddleWare.validateExcelFile,
    //     this.controller.uploadFile,
    //   );
  }
}

export default new TransactionRoutes().router;

import tutorialModel from '@/models/tutorial.model';
import { CustomRequest } from '@/types/request.type';
import Tutorial from '@/types/tutorial.type';
import { Request, Response } from 'express';

export default class TutorialController {
  async create(req: Request, res: Response) {
    try {
      const tutorial: Tutorial = req.body;
      const savedTutorial = await tutorialModel.save(tutorial);

      res.status(201).send({ success: true, message: 'Thêm mới thành công', data: savedTutorial });
    } catch (err) {
      console.log('Debug_here err: ', err);
      res.status(500).send({
        message: 'Some error occurred while retrieving tutorials.',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const title = typeof req.query.title === 'string' ? req.query.title : '';

    try {
      const tutorials = await tutorialModel.retrieveAll({ title });

      res.status(200).send(tutorials);
    } catch (err) {
      console.log('============== Debug_here err ==============');
      console.dir(err, { depth: null });

      res.status(500).send({
        message: 'Some error occurred while retrieving tutorials.',
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const tutorial = await tutorialModel.retrieveById(id);

      if (tutorial) res.status(200).send(tutorial);
      else
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Tutorial with id=${id}.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    const tutorial: Tutorial = req.body;
    tutorial.id = parseInt(req.params.id);

    try {
      const num = await tutorialModel.update(tutorial);
      console.log('Debug_here num: ', num);

      if (num == 1) {
        res.send({
          message: 'Tutorial was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${tutorial.id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Tutorial with id=${tutorial.id}.`,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await tutorialModel.delete(id);

      if (num == 1) {
        res.send({
          message: 'Tutorial was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Tutorial with id==${id}.`,
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await tutorialModel.deleteAll();

      res.send({ message: `${num} Tutorials were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred while removing all tutorials.',
      });
    }
  }

  async findAllPublished(req: Request, res: Response) {
    try {
      const tutorials = await tutorialModel.retrieveAll({ published: true });

      res.status(200).send(tutorials);
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred while retrieving tutorials.',
      });
    }
  }

  async uploadFile(req: CustomRequest, res: Response) {
    try {
      console.log('============== Debug_here req excelData ==============');
      console.dir(req?.excelData, { depth: null });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }
}

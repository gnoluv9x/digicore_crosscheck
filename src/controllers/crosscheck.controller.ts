import { CustomRequest } from '@/types/request.type';
import { Response } from 'express';

export default class CrosscheckController {
  async create(req: CustomRequest, res: Response) {
    try {
      console.log('Debug_here req: ', req.excelData);
      return res.status(200).send({ success: true });
    } catch (err) {
      console.log('Debug_here err: ', err);
      return res.status(500).send({
        message: 'Some error occurred while retrieving transactions.',
      });
    }
  }
}

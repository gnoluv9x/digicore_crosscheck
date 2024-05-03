import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants';
import transactionModel from '@/models/transaction.model';
import ITransaction from '@/types/transaction.type';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export default class TransactionController {
  async create(req: Request, res: Response) {
    try {
      const transaction: Prisma.transactionsCreateInput = req.body;
      console.log('Debug_here transaction: ', transaction);
      const savedTrans = await transactionModel.save(transaction);

      res.status(201).send({ success: true, message: 'Thêm mới thành công', data: savedTrans });
    } catch (err) {
      let message = 'Có lỗi xảy ra';
      console.log('Debug_here err: ', { err });
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          message = `Không thể tạo giao dịch do trùng ${err.meta?.target}`;
        }
      }

      res.status(500).send({ message });
    }
  }

  async findAll(req: Request, res: Response) {
    const productName = typeof req.query.productName === 'string' ? req.query.productName : '';
    const phoneNumber = typeof req.query.phoneNumber === 'string' ? req.query.phoneNumber : '';
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : DEFAULT_LIMIT;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : DEFAULT_PAGE;

    console.log('Debug_here req.query: ', req.query);

    try {
      const trans = await transactionModel.retrieveAll({ productName, phoneNumber, limit, page });

      res.status(200).send({ success: true, data: trans });
    } catch (err) {
      console.error('Debug_here err: ', err);

      res.status(500).send({
        success: false,
        message: 'Some error occurred while retrieving transactions.',
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const transaction = await transactionModel.retrieveById(id);

      if (transaction?.id) res.status(200).send({ success: true, data: transaction });
      else
        res.status(404).send({
          message: `Cannot find transaction with id=${id}.`,
        });
    } catch (err) {
      console.log('Debug_here err: ', err);
      res.status(500).send({
        message: `Error retrieving transaction with id=${id}.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    const transaction: ITransaction = req.body;
    transaction.id = parseInt(req.params.id);

    try {
      const transactionUpdated = await transactionModel.update(transaction);

      if (transactionUpdated?.id) {
        res.send({
          message: 'Transaction was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update transaction with id=${transaction.id}. Maybe transaction was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Error updating transaction with id=${transaction.id}.`,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const deletedTran = await transactionModel.delete(id);

      if (deletedTran?.id) {
        res.send({
          message: 'Transaction was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Transaction with id==${id}.`,
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await transactionModel.deleteAll();

      res.send({ message: `${num} transactions were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred while removing all transactions.',
      });
    }
  }
}

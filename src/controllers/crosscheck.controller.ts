import { EXCEL_FILE_DATE_FORMATED } from '@/constants';
import { downloadExcel, generateCrosscheckFileName } from '@/helper';
import crosscheckModel from '@/models/crosscheck.model';
import transactionModel from '@/models/transaction.model';
import { ICrosscheck } from '@/types/crosscheck.type';
import { ICrosscheckAfterMatchList, IFileRequest } from '@/types/file.type';
import { CustomRequest } from '@/types/request.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Request, Response } from 'express';

dayjs.extend(customParseFormat);

export default class CrosscheckController {
  async match(req: CustomRequest, res: Response) {
    try {
      const excelFiles: IFileRequest = req.excelData;
      const crossCheckData = excelFiles.excelData;
      console.log('Debug_here crossCheckData: ', crossCheckData);
      const listTransactions = await transactionModel.retrieveAll({ fileDateRange: excelFiles.fileDateRange });
      console.log('Debug_here listTransactions: ', listTransactions);

      // Match các bản ghi trong file excel và db
      const resultsCrosschecked: ICrosscheckAfterMatchList[] = [];
      crossCheckData.forEach((crosscheck) => {
        for (let i = 0; i < listTransactions.length; i++) {
          const tran = listTransactions[i];

          const isSameDay = dayjs(tran.date).isSame(dayjs(crosscheck?.THOI_GIAN, EXCEL_FILE_DATE_FORMATED));

          if (
            !tran.crossCheckId &&
            parseInt(crosscheck.MGD as any) === tran.orderId &&
            parseInt(crosscheck?.SDT as any) === parseInt(tran.phoneNumber) &&
            parseFloat(crosscheck?.GIA_BAN as any) === tran.totalPrice &&
            crosscheck?.GC === tran.productName &&
            isSameDay
          ) {
            resultsCrosschecked.push({ ...crosscheck, tranId: tran.id! });
            break;
          }
        }
      });

      if (resultsCrosschecked.length === 0) {
        const fileName = generateCrosscheckFileName();
        console.log('Debug_here fileName with empty file: ', fileName);
        return downloadExcel(resultsCrosschecked, res, excelFiles.fileDateRange, [], fileName);
      }

      const adminId = req.headers.adminid as string;

      const crosscheckData = {
        adminId: parseInt(adminId),
        fileName: excelFiles.fileName,
        filePath: excelFiles.filePath,
        totalTrans: 0,
      };

      await crosscheckModel.matchTransactions(crosscheckData, resultsCrosschecked);

      // const crosscheckCreated = await crosscheckModel.save({
      //   adminId: parseInt(adminId),
      //   fileName: excelFiles.fileName,
      //   filePath: excelFiles.filePath,
      //   totalTrans: 0,
      // });

      // const crossCheckId = crosscheckCreated?.id;
      // console.log('Debug_here crossCheckId: ', crossCheckId);

      // const updatedRecords = await crosscheckModel.updateMultipleTransactions(resultsCrosschecked, crossCheckId!);

      // await crosscheckModel.updateTotalTrans(crossCheckId!, updatedRecords?.length || 0);

      const fileName = generateCrosscheckFileName();

      return downloadExcel(resultsCrosschecked, res, excelFiles.fileDateRange, [], fileName);
    } catch (err) {
      console.log('Debug_here err: ', err);
      return res.status(500).send({
        message: 'Có lỗi xảy ra khi đối soát.',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const reqBody: Required<ICrosscheck> = req.body;
      console.log('Debug_here reqBody: ', reqBody);
      await crosscheckModel.save(reqBody);

      return res.status(200).send({ success: true });
    } catch (error) {
      console.log('Debug_here error: ', error);

      return res.status(402).send({ success: true });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = req.params?.page ? parseInt(req.params?.page) : 1;
      const limit = req.params?.limit ? parseInt(req.params?.limit) : 10;
      const results = await crosscheckModel.retrieveAll({ page, limit });
      res.json({ message: 'Thanh cong', data: results });
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }
}

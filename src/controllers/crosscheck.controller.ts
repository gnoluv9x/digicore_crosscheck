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
      const listTransactions = await transactionModel.retrieveAll({ fileDateRange: excelFiles.fileDateRange }); // TODO remove limit
      console.log('Debug_here listTransactions: ', listTransactions);

      // logger.log('info', 'Starting up with config %j', 'day la string');

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
            resultsCrosschecked.push({ ...crosscheck, id: tran.id! });
            break;
          }
        }
      });

      if (resultsCrosschecked.length === 0) {
        const fileName = generateCrosscheckFileName();
        console.log('Debug_here fileName: ', fileName);
        return downloadExcel(resultsCrosschecked, res, excelFiles.fileDateRange, fileName);
      }

      const adminId = req.headers.adminid as string;

      const crosscheckCreated = await crosscheckModel.save({
        adminId: parseInt(adminId),
        fileName: excelFiles.fileName,
        filePath: excelFiles.filePath,
        totalTrans: 0,
      } as Required<ICrosscheck>);

      const crossCheckId = crosscheckCreated.id;
      console.log('Debug_here crossCheckId: ', crossCheckId);

      await crosscheckModel.updateMultipleCrosscheck(resultsCrosschecked, crossCheckId);

      const fileName = generateCrosscheckFileName();

      console.log('Debug_here resultsCrosschecked: ', resultsCrosschecked);

      return downloadExcel(resultsCrosschecked, res, excelFiles.fileDateRange, fileName);
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
}

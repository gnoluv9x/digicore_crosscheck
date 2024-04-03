import { EXCEL_FILE_DATE_FORMATED } from '@/constants';
import { downloadExcel } from '@/helper';
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
      const listTransactions = await transactionModel.retrieveAll({ limit: 10, page: 1 }); // TODO remove limit
      console.log('============== Debug_here crossCheckData ==============');
      console.dir(crossCheckData, { depth: null });
      console.log('============== Debug_here listTransactions ==============');
      console.dir(listTransactions, { depth: null });

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
        const fileName = 'cross_checked_' + dayjs().format('DD-MM-YYYY_HH-mm-ss') + '.xlsx';
        downloadExcel(resultsCrosschecked, res, fileName);
        return;
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

      const fileName = 'cross_checked_' + dayjs().format('DD-MM-YYYY_HH-mm-ss') + '.xlsx';
      return downloadExcel(resultsCrosschecked, res, fileName);
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
      console.log('============== Debug_here reqBody ==============');
      console.dir(reqBody, { depth: null });
      const resp = await crosscheckModel.save(reqBody);
      console.log('Debug_here resp: ', resp);
      return res.status(200).send({ success: true });
    } catch (error) {
      console.log('Debug_here error: ', error);

      return res.status(402).send({ success: true });
    }
  }
}

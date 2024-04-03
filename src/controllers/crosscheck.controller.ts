import { EXCEL_FILE_DATE_FORMATED } from '@/constants';
import crosscheckModel from '@/models/crosscheck.model';
import transactionModel from '@/models/transaction.model';
import { ICrosscheck } from '@/types/crosscheck.type';
import { CustomRequest } from '@/types/request.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Request, Response } from 'express';
dayjs.extend(customParseFormat);

export default class CrosscheckController {
  async match(req: CustomRequest, res: Response) {
    try {
      const crossCheckData: any[] = req.excelData;
      const listTransactions = await transactionModel.retrieveAll({ limit: 10, page: 1 });

      // Match các bản ghi trong file excel và db
      const resultsCrosschecked = [];
      crossCheckData.forEach((crosscheck) => {
        for (let i = 0; i < listTransactions.length; i++) {
          const tran = listTransactions[i];

          const isSameDay = dayjs(tran.date).isSame(dayjs(crosscheck?.THOI_GIAN, EXCEL_FILE_DATE_FORMATED));

          if (
            !tran.crossCheckId &&
            crosscheck?.MGD === tran.orderId &&
            crosscheck?.SDT === parseInt(tran.phoneNumber!) &&
            crosscheck?.GIA_BAN === tran.totalPrice &&
            isSameDay
          ) {
            resultsCrosschecked.push(crosscheck);
            break;
          }
        }
      });

      const resultsss = await crosscheckModel.save({
        adminId: '123',
        totalTrans: 123123,
        fileName: 'file-213.xlsx',
        filePath: 'sabc/csdcd',
      } as Required<ICrosscheck>);

      console.log('============== Debug_here resultsss ==============');
      console.dir(resultsss, { depth: null });

      return res.status(200).send({ success: true });
    } catch (err) {
      console.log('Debug_here err: ', err);
      return res.status(500).send({
        message: 'Some error occurred while retrieving transactions.',
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

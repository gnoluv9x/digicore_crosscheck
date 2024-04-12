import { EXCEL_FILE_DATE_FORMATED } from '@/constants';
import { ALLOWED_CROSSCHECK_FIELDS_TO_CREATE } from '@/constants/crosscheck';
import { convertCamelToSnakeInObject } from '@/helper/utils';
import prisma from '@/lib/prisma';
import { IPagination } from '@/types';
import { ICrosscheck } from '@/types/crosscheck.type';
import { ICrosscheckAfterMatchList } from '@/types/file.type';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

class CrosscheckModel {
  public async retrieveAll(pagination: IPagination) {
    try {
      const skip = pagination.page * pagination.limit;
      const results = await prisma.crosscheck.findMany({ skip, take: pagination.limit });
      return results;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async save(data: Required<Omit<ICrosscheck, 'id' | 'created_at'>>) {
    try {
      const crosscheckData: Prisma.crosscheckCreateInput = convertCamelToSnakeInObject(
        data,
        ALLOWED_CROSSCHECK_FIELDS_TO_CREATE,
      );
      const crosscheck = await prisma.crosscheck.create({ data: crosscheckData });
      return crosscheck;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async retrieveById(crosscheckId: number) {
    try {
      const result = await prisma.crosscheck.findUnique({ where: { id: crosscheckId } });
      return result;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async updateTotalTrans(crosscheckId: number, trans: number) {
    try {
      const updateCrosscheck = await prisma.crosscheck.update({ where: { id: crosscheckId }, data: trans });
      return updateCrosscheck;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async updateMultipleTransactions(listCrosscheck: ICrosscheckAfterMatchList[], crosscheckId: number) {
    try {
      const updateMany = await prisma.$transaction(
        listCrosscheck.map((crosscheck) => {
          const cross_check_status = crosscheck.TT === 'Thành công' ? 'SUCCESS' : 'FAIL';
          const date = crosscheck.THOI_GIAN ? dayjs(crosscheck.THOI_GIAN, EXCEL_FILE_DATE_FORMATED).toISOString() : '';

          return prisma.transactions.update({
            where: { id: crosscheck.tranId },
            data: {
              cross_check_status: cross_check_status,
              cross_check_date: date,
              cross_check_id: crosscheckId,
            },
          });
        }),
      );

      return updateMany;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }
}

export default new CrosscheckModel();

import { EXCEL_FILE_DATE_FORMATED } from '@/constants';
import { ALLOWED_CROSSCHECK_FIELDS_TO_CREATE } from '@/constants/crosscheck';
import { getFieldsFromBody } from '@/helper/utils';
import prisma from '@/lib/prisma';
import { IPagination } from '@/types';
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
      throw error;
    }
  }

  public async save(data: Prisma.crosscheckCreateInput) {
    try {
      const crosscheck = getFieldsFromBody<Prisma.crosscheckCreateInput>(data, ALLOWED_CROSSCHECK_FIELDS_TO_CREATE);
      const createdCrosscheck = await prisma.crosscheck.create({ data: crosscheck });
      return createdCrosscheck;
    } catch (error) {
      console.log('Debug_here error: ', error);
      throw error;
    }
  }

  public async retrieveById(crosscheckId: number) {
    try {
      const result = await prisma.crosscheck.findUnique({ where: { id: crosscheckId } });
      return result;
    } catch (error) {
      console.log('Debug_here error: ', error);
      throw error;
    }
  }

  public async updateTotalTrans(crosscheckId: number, trans: number, prisma: any) {
    try {
      const updateCrosscheck = await prisma.crosscheck.update({
        where: { id: crosscheckId },
        data: { totalTrans: trans },
      });
      return updateCrosscheck;
    } catch (error) {
      console.log('Debug_here error: ', error);
      throw error;
    }
  }

  public async updateMultipleTransactions(listCrosscheck: ICrosscheckAfterMatchList[], crosscheckId: number) {
    try {
      const updateMany = await prisma.$transaction(
        listCrosscheck.map((crosscheck) => {
          const crossCheckStatus = crosscheck.TT === 'Thành công' ? 'success' : 'fail';
          const date = crosscheck.THOI_GIAN ? dayjs(crosscheck.THOI_GIAN, EXCEL_FILE_DATE_FORMATED).toISOString() : '';

          return prisma.transactions.update({
            where: { id: crosscheck.tranId },
            data: {
              crossCheckStatus: crossCheckStatus,
              crossCheckDate: date,
              crossCheckId: crosscheckId,
            },
          });
        }),
      );

      return updateMany;
    } catch (error) {
      console.log('Debug_here error: ', error);
      throw error;
    }
  }

  public async matchTransactions(
    crosscheckData: Prisma.crosscheckCreateInput,
    listCrosscheck: ICrosscheckAfterMatchList[],
  ) {
    try {
      prisma.$transaction(async (tx) => {
        // create crosscheck
        const crosscheck = getFieldsFromBody<Prisma.crosscheckCreateInput>(
          crosscheckData,
          ALLOWED_CROSSCHECK_FIELDS_TO_CREATE,
        );
        const createdCrosscheck = await tx.crosscheck.create({ data: crosscheck });
        const crosscheckId = createdCrosscheck?.id;

        // update trans
        const crosscheckPromises = listCrosscheck.map((crosscheck) => {
          const crossCheckStatus = crosscheck.TT === 'Thành công' ? 'success' : 'fail';
          const date = dayjs().toISOString();

          return tx.transactions.update({
            where: { id: crosscheck.tranId },
            data: {
              crossCheckStatus: crossCheckStatus,
              crossCheckDate: date,
              crossCheckId: crosscheckId,
            },
          });
        });
        const updatedTrans = await Promise.all(crosscheckPromises);

        // update total trans
        await tx.crosscheck.update({
          where: { id: crosscheckId },
          data: { totalTrans: updatedTrans.length || 0 },
        });
      });
    } catch (error) {
      console.log('Debug_here error: ', error);
      throw error;
    }
  }
}

export default new CrosscheckModel();

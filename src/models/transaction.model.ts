import { EXCEL_FILE_DATE_FORMATED, MONTH_IN_PAST, PAGINATION_UNLIMIT } from '@/constants';
import { ALLOWED_FIELDS_TO_CREATE, ALLOWED_FIELDS_TO_UPDATE } from '@/constants/transaction';
import { convertCamelToSnakeInObject, convertSnakeKeyToCamelInObject } from '@/helper/utils';
import prisma from '@/lib/prisma';
import ITransaction, { TransactionSearchParams } from '@/types/transaction.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

class TransactionModel {
  public async save(transaction: ITransaction) {
    try {
      const data = convertCamelToSnakeInObject(transaction, ALLOWED_FIELDS_TO_CREATE);

      const transactionCreated = await prisma.transactions.create({ data });
      console.log('Debug_here transactionCreated: ', transactionCreated);

      return transactionCreated;
    } catch (error) {
      throw error;
    }
  }

  public async retrieveAll(searchParams?: Partial<TransactionSearchParams>) {
    const condition: any[] = [];
    const pagination: Record<string, string | number> = {};

    if (searchParams?.productName) {
      condition.push({ product_name: { contains: searchParams.productName } });
    }

    if (searchParams?.phoneNumber) {
      condition.push({ phone_number: { contains: searchParams.phoneNumber } });
    }

    if (searchParams?.fileDateRange) {
      const from = searchParams?.fileDateRange?.from
        ? dayjs(searchParams?.fileDateRange?.from, EXCEL_FILE_DATE_FORMATED).toISOString()
        : dayjs().subtract(MONTH_IN_PAST, 'month').toISOString();
      const to = searchParams?.fileDateRange?.to
        ? dayjs(searchParams?.fileDateRange?.to, EXCEL_FILE_DATE_FORMATED).toISOString()
        : dayjs().toISOString();

      condition.push({
        date: {
          gte: from,
          lte: to,
        },
      });
    }

    if (searchParams?.limit && searchParams.limit !== PAGINATION_UNLIMIT) {
      const page = searchParams?.page || 1;
      const skip = (page - 1) * searchParams.limit;
      pagination.skip = skip;
      pagination.take = searchParams.limit;
    }

    const queryResults = await prisma.transactions.findMany({
      where: {
        AND: condition,
      },
      ...pagination,
    });

    const results = queryResults.map((result) => convertSnakeKeyToCamelInObject<ITransaction>(result));

    return results;
  }

  public async retrieveById(transactionId: number) {
    try {
      const queryResult = await prisma.transactions.findUnique({ where: { id: transactionId } });
      const result = convertSnakeKeyToCamelInObject<ITransaction>(queryResult!);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async update(transaction: ITransaction) {
    try {
      const { id: transactionId, ...restTrans } = transaction;

      const newTrans = convertCamelToSnakeInObject(restTrans, ALLOWED_FIELDS_TO_UPDATE);

      const updateCrosscheck = await prisma.transactions.update({ where: { id: transactionId }, data: newTrans });
      return updateCrosscheck;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async delete(transactionId: number) {
    try {
      const deleteTran = prisma.transactions.delete({
        where: {
          id: transactionId,
        },
      });

      return deleteTran;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }

  public async deleteAll() {
    try {
      const deleteUsers = await prisma.transactions.deleteMany({});

      return deleteUsers;
    } catch (error) {
      console.log('Debug_here error: ', error);
    }
  }
}

export default new TransactionModel();

import { PAGINATION_UNLIMIT, TRANSACTION_KEY } from '@/constants';
import { convertCamelToSnakeCase, getAliasTransactionName } from '@/helper';
import ITransaction, { ITransactionModel, TransactionSearchParams } from '@/types/transaction.type';
import { ResultSetHeader } from 'mysql2';
import connection from '@/db';

class TransactionModel implements ITransactionModel {
  save(transaction: ITransaction): Promise<ITransaction> {
    const queryString = 'INSERT INTO transactions (PLACEHOLDER) VALUES(?)';

    let columnName = '';
    const columnValues: string[] = [];

    Object.keys(transaction).forEach((key, idx, arr) => {
      if (TRANSACTION_KEY.hasOwnProperty(key)) {
        let suffix = ', ';
        if (idx === arr.length - 1) suffix = '';
        columnName += `${TRANSACTION_KEY[key]}` + suffix;
        columnValues.push(transaction[key]);
      }
    });

    const newQuery = queryString.replace('PLACEHOLDER', columnName);

    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(newQuery, [columnValues], (err, res) => {
        if (err) reject(err);
        else
          this.retrieveById(res.insertId)
            .then((tutorial) => resolve(tutorial!))
            .catch(reject);
      });
    });
  }

  async retrieveAll(searchParams?: Partial<TransactionSearchParams>): Promise<ITransaction[]> {
    let query: string = `SELECT ${getAliasTransactionName()} FROM transactions`;
    let condition: string = '';

    if (searchParams?.productName) {
      condition += `LOWER(product_name) LIKE '%${searchParams.productName}%'`;
    }

    if (searchParams?.phoneNumber) {
      condition += ` AND LOWER(phone_number) LIKE '%${searchParams.phoneNumber}%'`;
    }

    if (condition.length) query += ' WHERE ' + condition;

    if (searchParams?.page && searchParams?.limit && searchParams.limit !== PAGINATION_UNLIMIT) {
      query += ` LIMIT ${searchParams.limit} OFFSET ${(searchParams.page - 1) * searchParams.limit}`;
    }

    console.log('Debug_here query: ', query);

    return new Promise((resolve, reject) => {
      connection.query<ITransaction[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  retrieveById(transactionId: number): Promise<ITransaction | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<ITransaction[]>(
        `SELECT ${getAliasTransactionName()} FROM transactions WHERE id = ?`,
        [transactionId],
        (err, res) => {
          console.log('Debug_here res: ', res);
          if (err) reject(err);
          else resolve(res?.[0]);
        },
      );
    });
  }

  update(transaction: ITransaction): Promise<number> {
    const { id: transactionId, ...restTrans } = transaction;
    const newTrans: Record<string, any> = Object.keys(restTrans).reduce((prev: any, curKey: string) => {
      const newKey = convertCamelToSnakeCase(curKey);
      const newVal = restTrans[curKey];
      prev[newKey] = newVal;

      return prev;
    }, {});

    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE transactions SET ? WHERE id = ?',
        [newTrans, transactionId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        },
      );
    });
  }

  delete(transactionId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [transactionId], (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM transactions', (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new TransactionModel();

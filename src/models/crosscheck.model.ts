import connection from '@/db';
import { getQueryStringUpdateCrosscheck } from '@/helper';
import { ICrosscheck, ICrosscheckModel } from '@/types/crosscheck.type';
import { ICrosscheckAfterMatchList } from '@/types/file.type';
import { ResultSetHeader } from 'mysql2';

class CrosscheckModel implements ICrosscheckModel {
  retrieveAll(): Promise<ICrosscheck[]> {
    const queryString = 'SELECT * FROM transactions';

    return new Promise(() => {
      connection.query<ResultSetHeader>(queryString, () => {});
    });
  }

  save(record: Required<ICrosscheck>): Promise<ICrosscheck> {
    const query = 'INSERT INTO crosscheck(file_name, file_path, total_trans, admin_id) VALUES(?,?,?,?)';
    const values = [record.fileName, record.filePath, record.totalTrans, record.adminId];

    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(query, values, (err, res) => {
        if (err) reject(err);
        else
          this.retrieveById(res.insertId)
            .then((crosscheck) => resolve(crosscheck!))
            .catch(reject);
      });
    });
  }

  retrieveById(recordId: number): Promise<ICrosscheck | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<ICrosscheck[]>(`SELECT * FROM crosscheck WHERE id = ?`, [recordId], (err, res) => {
        if (err) reject(err);
        else resolve(res?.[0]);
      });
    });
  }

  updateTrans(crosscheckId: number, trans: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('UPDATE crosscheck SET ? WHERE id = ?', [trans, crosscheckId], (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }

  updateMultipleCrosscheck(listCrosscheck: ICrosscheckAfterMatchList[], crosscheckId: number): Promise<number> {
    const queryString = getQueryStringUpdateCrosscheck(listCrosscheck, crosscheckId);

    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(queryString, (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new CrosscheckModel();

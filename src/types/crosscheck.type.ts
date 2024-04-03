import { RowDataPacket } from 'mysql2';
import { IBaseModel } from '.';

export interface ICrosscheck extends RowDataPacket {
  fileName?: string;
  filePath?: string;
  totalTrans?: number;
  adminId?: string;
}

export interface ICrosscheckModel extends Partial<IBaseModel<ICrosscheck>> {
  updateTrans(crosscheckId: number, trans: number): Promise<number>;
}

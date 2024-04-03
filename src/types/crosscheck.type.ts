import { RowDataPacket } from 'mysql2';
import { IBaseModel } from '.';
import { ICrosscheckList } from '@/types/file.type';

export interface ICrosscheck extends RowDataPacket {
  fileName?: string;
  filePath?: string;
  totalTrans?: number;
  adminId?: number;
}

export interface ICrosscheckModel extends Partial<IBaseModel<ICrosscheck>> {
  updateTrans(crosscheckId: number, trans: number): Promise<number>;
  updateMultipleCrosscheck(listCrosscheck: ICrosscheckList[], crosscheckId: number): Promise<number>;
}

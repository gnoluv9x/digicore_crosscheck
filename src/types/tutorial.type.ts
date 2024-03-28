import { RowDataPacket } from 'mysql2';
import { IBaseModel } from '.';

export default interface Tutorial extends RowDataPacket {
  id?: number;
  title?: string;
  description?: string;
  published?: boolean;
}

export interface ITutorialModel extends IBaseModel<Tutorial> {}

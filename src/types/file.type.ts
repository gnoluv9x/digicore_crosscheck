export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}

export interface IFileRequest {
  fileName: string;
  filePath: string;
  excelData: ICrosscheckList[];
}

export interface ICrosscheckList {
  STT: string;
  MGD: number;
  SDT: number;
  NDDV: string;
  GC: string;
  KENH: string;
  GIA_BAN: number;
  TI_LE: string;
  HOA_HONG: string;
  THOI_GIAN: string;
  TT: string;
  DAI_LY_CON: string;
  CTGD: string;
}

export interface ICrosscheckAfterMatchList extends ICrosscheckList {
  id: number;
}

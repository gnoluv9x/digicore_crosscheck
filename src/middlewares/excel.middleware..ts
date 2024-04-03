import { NextFunction, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import xlsx from 'xlsx';
import dayjs from 'dayjs';
import { IFile } from '@/types/file.type';
import { CustomRequest } from '@/types/request.type';
import { CROSSCHECK_EXCEL_HEADER_LIST, CROSSCHECK_EXCEL_SKIPPED_ROWS } from '@/constants';

class ExcelMiddleware {
  constructor() {
    this.handleUpload = this.handleUpload.bind(this);
  }

  private _storage = multer.diskStorage({
    destination: function (_, __, cb) {
      const uploadDir = process.cwd() + '/uploads';

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = dayjs().format('DD_MM_YYYY-HH_mm_ss');
      cb(null, file.fieldname + '-' + uniqueSuffix + '.xlsx');
    },
  });

  private static _checkIsExcelFile(file: IFile) {
    return file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml');
  }

  private _uploadExcel = multer({
    storage: this._storage,
    fileFilter: (req, file, cb) => {
      if (!ExcelMiddleware._checkIsExcelFile(file)) {
        return cb(new Error('Chỉ chấp nhận file Excel'));
      }
      cb(null, true);
    },
  }).single('file');

  public handleUpload(req: CustomRequest, res: Response, next: NextFunction) {
    this._uploadExcel(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log('============== Debug_here err ==============');
        console.dir(err, { depth: null });
        return res.status(400).json({ error: 'Lỗi khi upload file' });
      } else if (err) {
        console.log('============== Debug_here err ==============');
        console.dir(err, { depth: null });
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Vui lòng chọn file Excel' });
      }

      try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Giả sử chỉ có 1 sheet
        const worksheet = workbook.Sheets[sheetName];

        // skip x rows before read file
        const range = xlsx.utils.decode_range(worksheet['!ref'] as string);
        range.s.r = CROSSCHECK_EXCEL_SKIPPED_ROWS;

        const jsonData = xlsx.utils.sheet_to_json(worksheet, {
          rawNumbers: true,
          range,
          header: CROSSCHECK_EXCEL_HEADER_LIST,
        });

        // truyền file sang middleware tiếp theo
        req.excelData = jsonData;

        // xoá file
        // fs.unlinkSync(req.file.path);

        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý file Excel.' });
      }
    });
  }
}

export default ExcelMiddleware;

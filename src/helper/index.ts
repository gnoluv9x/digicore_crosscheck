import { DATE_FORMATED, TRANSACTION_KEY } from '@/constants';
import { ICrosscheckAfterMatchList } from '@/types/file.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Response } from 'express';
import xlsx from 'xlsx';

dayjs.extend(customParseFormat);

export const convertCamelToSnakeCase = (str: string): string => {
  if (!str) return '';

  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const convertSnakeToCamel = (str: string) => {
  if (!str) return '';

  return str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
};

export const getAliasTransactionName = () => {
  const arr = Object.keys(TRANSACTION_KEY).map((key) => TRANSACTION_KEY[key] + ' as ' + key);

  const result = arr.join(',');

  return result;
};

export const isFloatNumber = (numb: number) => {
  return Number(numb) === numb && numb % 1 !== 0;
};

export const checkValidDate = (value: string) => {
  // trường này có thể falsy
  if (!value) return true;

  const isValid = dayjs(value, DATE_FORMATED, true).isValid();
  const isPastTime = dayjs(value, DATE_FORMATED).isBefore(dayjs());

  return isValid ? isPastTime : false;
};

export const checkIntegerOrFloatNumber = (value: number | string) => {
  if (typeof value === 'string') return false;
  // trường này có thể falsy
  if (!value) return true;

  return Number.isInteger(value) ? true : isFloatNumber(value);
};

export const getQueryStringUpdateCrosscheck = (
  listCrosscheck: ICrosscheckAfterMatchList[],
  crosscheckId: number,
): string => {
  let queryString = `UPDATE transactions SET cross_check_id = ${crosscheckId}, `;
  let idsString = '';
  let crossCheckStatus = 'cross_check_status  = (case ';
  let crossCheckDate = 'cross_check_date  = (case ';

  listCrosscheck.forEach((crosscheck, idx, arr) => {
    idsString += `${crosscheck.id}` + (idx !== arr.length - 1 ? ',' : '');
    crossCheckStatus += `when id = ${crosscheck.id} then '${crosscheck.TT === 'Thành công' ? '1' : '0'}' `;

    const date = crosscheck.THOI_GIAN
      ? dayjs(crosscheck.THOI_GIAN, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
      : '';

    crossCheckDate += `when id = ${crosscheck.id} then '${date}' `;
  });

  crossCheckStatus += ' end)';
  crossCheckDate += ' end)';

  queryString += `${crossCheckStatus}, ${crossCheckDate} WHERE id in (${idsString})`;

  return queryString;
};

export function downloadExcel(listings: any[], res: Response, filename?: string) {
  try {
    const workbook = xlsx.utils.book_new();

    const worksheet = xlsx.utils.json_to_sheet(listings);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return res.status(500).send('Error generating Excel file');
  }
}

import { DATE_FORMATED, EXCEL_FILE_DATE_FORMATED } from '@/constants';
import { DETAIL_HEADERS, GENERAL_HEADERS } from '@/constants/excel';
import { FileDateRange, ICrosscheckAfterMatchList } from '@/types/file.type';
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
    idsString += `${crosscheck.tranId}` + (idx !== arr.length - 1 ? ',' : '');
    crossCheckStatus += `when id = ${crosscheck.tranId} then '${crosscheck.TT === 'Thành công' ? '1' : '0'}' `;

    const date = crosscheck.THOI_GIAN
      ? dayjs(crosscheck.THOI_GIAN, EXCEL_FILE_DATE_FORMATED).format(DATE_FORMATED)
      : '';

    crossCheckDate += `when id = ${crosscheck.tranId} then '${date}' `;
  });

  crossCheckStatus += ' end)';
  crossCheckDate += ' end)';

  queryString += `${crossCheckStatus}, ${crossCheckDate} WHERE id in (${idsString})`;

  return queryString;
};

export function downloadExcel(
  generalListings: any[],
  res: Response,
  dateRange: FileDateRange,
  detailListings: any[],
  filename?: string,
) {
  try {
    const workbook = xlsx.utils.book_new();

    const dateRangeString = `Từ ngày: ${dateRange?.from || '---'} đến ngày: ${dateRange?.to || '---'} `;

    const generalSheet = xlsx.utils.aoa_to_sheet([
      ['TỔNG HỢP KẾT QUẢ BÁN GÓI QUA 9084'],
      [dateRangeString],
      GENERAL_HEADERS,
      generalListings,
    ]);
    const detailsSheet = xlsx.utils.aoa_to_sheet([
      ['CHI TIẾT KẾT QUẢ BÁN GÓI QUA 9084'],
      [dateRangeString],
      DETAIL_HEADERS,
      detailListings,
    ]);

    xlsx.utils.book_append_sheet(workbook, generalSheet, 'Tổng hợp');
    xlsx.utils.book_append_sheet(workbook, detailsSheet, 'Chi tiết');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return res.status(500).send('Error generating Excel file');
  }
}

export const generateCrosscheckFileName = () => {
  const fileName = 'MBS_Bao_cao_ban_goi_VAS_9084__' + dayjs().format('HH_mm_ss_DD_MM_YYYY') + '.xlsx';

  return encodeURIComponent(fileName);
};

export const getDateRange = (str: string): FileDateRange => {
  if (!str) return { from: '', to: '' };

  const datePattern = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/g;

  const dates = str.match(datePattern) as string[];

  return { from: dates[0], to: dates[1] };
};

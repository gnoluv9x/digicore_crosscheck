import { DATE_FORMATED } from '@/constants';
import { convertCamelToSnakeCase, convertSnakeToCamel } from '@/helper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export function convertSnakeKeyToCamelInObject<T extends object>(obj: Record<string, any>): T | Record<string, any> {
  if (typeof obj !== 'object' || Object.keys(obj).length === 0) return obj;

  const results = Object.keys(obj).reduce<any>((acc, key) => {
    const camelCaseName = convertSnakeToCamel(key);
    acc[camelCaseName] = obj[key];

    return acc;
  }, {});

  return results;
}

export function convertCamelToSnakeInObject(obj: Record<string, any>, allowedColumnName: string[]) {
  if (typeof obj !== 'object' || Object.keys(obj).length === 0) return obj;

  const results = Object.keys(obj).reduce<any>((acc, key) => {
    const snakeCaseName = convertCamelToSnakeCase(key);

    if (allowedColumnName.includes(snakeCaseName)) {
      if (snakeCaseName === 'date') {
        acc[snakeCaseName] = dayjs(obj[key], DATE_FORMATED).toISOString();
      } else {
        acc[snakeCaseName] = obj[key];
      }
    }

    return acc;
  }, {});

  return results;
}

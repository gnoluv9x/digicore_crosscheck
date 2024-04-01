import { DATE_FORMATED, TRANSACTION_KEY } from '@/constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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

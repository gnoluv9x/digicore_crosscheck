import { checkIntegerOrFloatNumber, checkValidDate } from '@/helper';
import { Schema } from 'express-validator';

const CROSS_CHECK_STATUS = ['0', '1'];
const LIST_PROVIDERS = ['mobifone', 'vinaphone', 'viettel'];
const LIST_ORDER_STATUS = ['success', 'pending', 'fail'];
const LIST_PRODUCT_TYPES = ['packagemobile', 'card', 'datacode', 'sim'];
const LIST_REGISTER_TYPES = ['otp', 'sms'];

export const createTransactionSchema: Schema = {
  orderId: {
    exists: {
      errorMessage: 'Thiếu trường orderId',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'orderId không được để trống',
      bail: true,
    },
    isNumeric: {
      errorMessage: 'Định dạng orderId phải là số',
    },
  },
  phoneNumber: {
    exists: {
      errorMessage: 'Thiếu trường phoneNumber',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'phoneNumber không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng phoneNumber phải là string',
      bail: true,
    },
    matches: {
      options: [/^84\d{9,10}$/],
      errorMessage: 'Sai định dạng số điện thoại',
    },
  },
  productName: {
    exists: {
      errorMessage: 'Thiếu trường productName',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'productName không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng productName phải là string',
    },
  },
  productType: {
    exists: {
      errorMessage: 'Thiếu trường productType',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'productType không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng productType phải là string',
      bail: true,
    },
    isIn: {
      options: [LIST_PRODUCT_TYPES],
      errorMessage: 'Giá trị productType không hợp lệ',
    },
  },
  packageRegisterType: {
    exists: {
      errorMessage: 'Thiếu trường packageRegisterType',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'packageRegisterType không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng packageRegisterType phải là string',
      bail: true,
    },
    isIn: {
      options: [LIST_REGISTER_TYPES],
      errorMessage: 'Giá trị packageRegisterType không hợp lệ',
    },
  },
  orderStatus: {
    exists: {
      errorMessage: 'Thiếu trường orderStatus',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'orderStatus không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng orderStatus phải là string',
      bail: true,
    },
    isIn: {
      options: [LIST_ORDER_STATUS],
      errorMessage: 'Giá trị orderStatus không hợp lệ',
    },
  },
  provider: {
    exists: {
      errorMessage: 'Thiếu trường provider',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'provider không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng provider phải là string',
      bail: true,
    },
    isIn: {
      options: [LIST_PROVIDERS],
      errorMessage: 'Giá trị provider không hợp lệ',
    },
  },
  totalPrice: {
    exists: {
      errorMessage: 'Thiếu trường totalPrice',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'totalPrice không được để trống',
      bail: true,
    },
    isNumeric: {
      errorMessage: 'Định dạng totalPrice phải là số',
    },
  },
  commissionAgent: {
    optional: true,
    custom: {
      options: checkIntegerOrFloatNumber,
    },
    errorMessage: 'Giá trị commissionAgent không hợp lệ',
  },
  commissionSubAgent: {
    optional: true,
    custom: {
      options: checkIntegerOrFloatNumber,
    },
    errorMessage: 'Giá trị commissionSubAgent không hợp lệ',
  },
  agentId: {
    exists: {
      errorMessage: 'Thiếu trường agentId',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'agentId không được để trống',
      bail: true,
    },
    isInt: {
      errorMessage: 'Định dạng agentId phải là số',
    },
  },
  subAgentId: {
    exists: {
      errorMessage: 'Thiếu trường subAgentId',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'subAgentId không được để trống',
      bail: true,
    },
    isInt: {
      errorMessage: 'Định dạng subAgentId phải là số',
    },
  },
  date: {
    optional: true,
    custom: {
      options: checkValidDate,
    },
    errorMessage: 'Giá trị date không hợp lệ',
  },
  successDate: {
    optional: true,
    custom: {
      options: checkValidDate,
    },
    errorMessage: 'Giá trị successDate không hợp lệ',
  },
  crossCheckId: {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value === 'string') return false;
        // trường này có thể falsy
        if (!value) return true;

        return Number.isInteger(value);
      },
    },
    errorMessage: 'Định dạng crossCheckId phải là số',
  },
  crossCheckStatus: {
    optional: true,
    custom: {
      options: (value) => {
        // trường này có thể falsy
        if (!value) return true;

        return CROSS_CHECK_STATUS.includes(value);
      },
    },
    errorMessage: 'Giá trị crossCheckStatus không hợp lệ',
  },
  crossCheckDate: {
    optional: true,
    custom: {
      options: checkValidDate,
    },
    errorMessage: 'Giá trị crossCheckDate không hợp lệ',
  },
  createdAt: {
    optional: true,
    custom: {
      options: checkValidDate,
    },
    errorMessage: 'Giá trị createdAt không hợp lệ',
  },
};

import { ICrosscheck } from '@/types/crosscheck.type';
import ITransaction from '@/types/transaction.type';

export const CROSSCHECK_EXCEL_SKIPPED_ROWS = 5;

export const CROSSCHECK_EXCEL_HEADER_LIST = [
  'STT',
  'MGD',
  'SDT',
  'NDDV',
  'GC',
  'KENH',
  'GIA_BAN',
  'TI_LE',
  'HOA_HONG',
  'THOI_GIAN',
  'TT',
  'DAI_LY_CON',
  'CTGD',
];

export const TRANSACTION_KEY: Record<keyof ITransaction, string> = {
  id: 'id',
  orderId: 'order_id',
  phoneNumber: 'phone_number',
  productName: 'product_name',
  productType: 'product_type',
  packageRegisterType: 'package_register_type',
  orderStatus: 'order_status',
  provider: 'provider',
  totalPrice: 'total_price',
  commissionAgent: 'commission_agent',
  commissionSubAgent: 'commission_sub_agent',
  agentId: 'agent_id',
  subAgentId: 'sub_agent_id',
  date: 'date',
  successDate: 'success_date',
  crossCheckId: 'cross_check_id',
  crossCheckStatus: 'cross_check_status',
  crossCheckDate: 'cross_check_date',
  createdAt: 'created_at',
};

export const CROSSCHECK_KEY: Record<keyof ICrosscheck, string> = {
  fileName: 'file_name',
  filePath: 'file_path',
  adminId: 'admin_id',
  totalTrans: 'total_trans'
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const DATE_FORMATED = 'YYYY-MM-DD HH:mm:ss';
export const EXCEL_FILE_DATE_FORMATED = 'DD-MM-YYYY HH:mm:ss';
export const PAGINATION_UNLIMIT = -1;

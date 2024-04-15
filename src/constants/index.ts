import { ICrosscheck } from '@/types/crosscheck.type';

export const CROSSCHECK_EXCEL_SKIPPED_ROWS = 1;
export const CROSSCHECK_EXCEL_SKIPPED_COLUMNS = 1;

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

export const TRANSACTION_KEY: Record<string, string> = {
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

export const CROSSCHECK_KEY: Record<keyof Omit<ICrosscheck, 'id' | 'created_at'>, string> = {
  fileName: 'file_name',
  filePath: 'file_path',
  adminId: 'admin_id',
  totalTrans: 'total_trans',
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const DATE_FORMATED = 'YYYY-MM-DD HH:mm:ss';
export const EXCEL_FILE_DATE_FORMATED = 'DD/MM/YYYY HH:mm';
export const PAGINATION_UNLIMIT = -1;

// Số tháng được dùng để giới hạn làm đối soát trong TH file excel không truyền khoảng ngày
export const MONTH_IN_PAST = 1;
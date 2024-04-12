import { FileDateRange } from '@/types/file.type';

type PRODUCT_TYPE = 'packagemobile' | 'card' | 'datacode' | 'sim';
type ORDER_STATUS_TYPE = 'success' | 'pending' | 'fail';
type PACKAGE_REGISTER_TYPE = 'otp' | 'sms';
type PROVIDER_TYPE = 'mobifone' | 'vinaphone' | 'viettel';
type CROSSCHECK_STATUS_TYPE = '0' | '1';

export default interface ITransaction {
  id?: number;
  orderId?: number;
  phoneNumber?: string;
  productName?: string;
  productType?: PRODUCT_TYPE;
  packageRegisterType?: PACKAGE_REGISTER_TYPE;
  orderStatus?: ORDER_STATUS_TYPE;
  provider?: PROVIDER_TYPE;
  totalPrice?: number;
  commissionAgent?: number;
  commissionSubAgent?: number;
  agentId?: number;
  subAgentId?: number;
  date?: string;
  successDate?: string;
  crossCheckId?: number;
  crossCheckStatus?: CROSSCHECK_STATUS_TYPE;
  crossCheckDate?: string;
  createdAt?: string;
}

export type TransactionSearchParams = {
  productName?: string;
  phoneNumber?: string;
  limit: number;
  page: number;
  fileDateRange: FileDateRange;
};

export type ITransactionColumnName =
  | 'id'
  | 'order_id'
  | 'phone_number'
  | 'product_name'
  | 'product_type'
  | 'package_register_type'
  | 'order_status'
  | 'provider'
  | 'total_price'
  | 'commission_agent'
  | 'commission_sub_agent'
  | 'agent_id'
  | 'sub_agent_id'
  | 'date'
  | 'success_date'
  | 'cross_check_id'
  | 'cross_check_status'
  | 'cross_check_date'
  | 'created_at';

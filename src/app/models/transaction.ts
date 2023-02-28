export interface TransactionModel {
  id?: any;
  createDate?: any;
  label?: any;
  taskMasterTransactionId?: any;
  sales?: [];
  date?:any;
  saleTransactionId?:any;
  isSuccess?:any;
  tanantId?:any;
  tenant?:any;
  taskId?:any;
  errorLog?:any;
  saleTransaction?:any;
}

export interface SaleTransactionDetailModel {
  orderDateTime?: any;
  receiptId?: any;
  grandTotal?: any;
  currency?:any;
}
export interface ErrorLogModel {
  id?:any;
  dateLog?:any;
  errorLogs?:any;
  datalog?:any;
  refCode?:any;
  errorLog?:any;
}

export interface SaleStatusModel {
  name?:any;
  key?:any;
}
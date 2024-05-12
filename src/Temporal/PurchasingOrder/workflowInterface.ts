export interface Response {
    sync_accurate_error: PurchaseOrder[];
    sync_accurate_success: PurchaseOrder[];
    sync_frappe_error: PurchaseOrder[];
    sync_frappe_success: PurchaseOrder[];
}
  
export interface PurchaseOrder {
    id?: number | 0;
    id_purchase_order: String;
    id_supplier: String;
    id_supplier_accurate?: String | "";
    grand_total?: Number | 0;
    transaction_date: String;
    address: string;
    id_accurate?: String | "";
    items?: Item[]
}

export interface Item{
    qty: Number,
    rate: Number,
    id_accurate: String,
    item_name: string
}
export interface DataCron{
    sync_success: FailedData[];
    sync_failed: FailedData[];
}

export interface FailedData{
    id: number;
    id_frappe: string;
    id_accurate: string;
}
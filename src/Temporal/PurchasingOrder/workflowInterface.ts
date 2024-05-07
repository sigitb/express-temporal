export interface Response {
    sync_accurate_error: any[];
    sync_accurate_success: any[];
    sync_frappe_error: any[];
    sync_frappe_success: any[];
}
  
export interface PurchaseOrder {
    id_purchase_order: String;
    id_supplier: String;
    id_supplier_accurate?: String | "";
    transaction_date: String;
    id_accurate?: String | "";
    items?: Item[]
}

export interface Item{
    qty: Number,
    rate: Number,
    id_item_accurate: String,
    item_name: string
}
export interface Item{
    qty: Number,
    rate: Number,
    id_accurate: Number,
    item_name: string
}

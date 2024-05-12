export interface ResponseWorkflow {
    sync_accurate_error: PurchaseInvoice[];
    sync_accurate_success: PurchaseInvoice[];
    sync_frappe_error: PurchaseInvoice[];
    sync_frappe_success: PurchaseInvoice[];
}

export interface PurchaseInvoice {
    transaction_date: string;
    supplier: string;
    purchase_order: string;
    purchase_invoice: string;
    items?: Item[];
    id_accurate?: string;
}

export interface Item {
    id: number,
    price: number,
    quantity: number
}

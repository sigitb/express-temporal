export interface ResponseWorkflow {
    sync_accurate_error: any[];
    sync_accurate_success: any[];
    sync_frappe_error: any[];
    sync_frappe_success: any[];
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

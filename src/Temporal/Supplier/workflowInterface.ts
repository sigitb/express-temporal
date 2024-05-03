export interface Data {
    sync_accurate_error: any[];
    sync_accurate_success: any[];
    sync_frappe_error: any[];
    sync_frappe_success: any[];
}

export interface Supplier {
    id: string;
    name: string;
    id_accurate?: number | null;
}
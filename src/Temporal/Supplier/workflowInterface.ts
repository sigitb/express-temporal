export interface Data {
    sync_accurate_error: Supplier[];
    sync_accurate_success: Supplier[];
    sync_frappe_error: Supplier[];
    sync_frappe_success: Supplier[];
}

export interface Supplier {
    id: string;
    name: string;
    join_date: string;
    id_accurate?: string | "";
    id_frappe?: string | "";
}

export interface FailedData{
    id: number;
    id_accurate: string;
    id_frappe: string
}

export interface DataCron{
    sync_success: FailedData[];
    sync_failed: FailedData[];
}
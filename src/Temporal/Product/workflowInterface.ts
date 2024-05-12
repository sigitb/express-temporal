export interface Data {
    sync_accurate_error?: Product[];
    sync_accurate_success?: Product[];
    sync_frappe_error?: Product[];
    sync_frappe_success?: Product[];
}
  
export interface Product {
    id: string;
    name: string;
    id_accurate?: number | null;
    id_frappe?: string | '';
}

export interface FailedData{
    id: number;
    id_accurate: number;
    id_frappe: string
}

export interface DataCron{
    sync_success?: FailedData[];
    sync_failed?: FailedData[];
}
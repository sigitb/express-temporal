export interface Data {
    sync_accurate_error: any[];
    sync_accurate_success: any[];
    sync_frappe_error: any[];
    sync_frappe_success: any[];
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
    sync_success: any[];
    sync_failed: any[];
}
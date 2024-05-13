import { ResponseProductSupllier, ResponseWorkflow } from "../Controllers/Accurate/AccurateInterface";
import AccurateService from "../Services/AccurateService";
import FrappeService from "../Services/FrappeService";
import LogSyncService from "../Services/LogSyncService";
import Temporal from "../Temporal/Connections/Temporal";
import { syncFailedAccurate, syncFailedFrappe } from "../Temporal/PurchaseInvoice/workflows";
import { SyncType } from "../Utils/EnumUtil";
import ResponseUtil from "../Utils/ResponseUtil";
import Stringutil from "../Utils/StringUtil";

export const FailedFrappeJobPurchaseInvoice = async () => {
    const service: FrappeService = new FrappeService
    const data = await service.getDataFailedPruchaseInvoice()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedFrappe, {
            taskQueue: 'accurate-sync-purchase-invoice',
            args: [],
            workflowId: 'job-sync-temporal-purchase-invoice-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        let dataResult = await handle.result()
        service.log('JOB-FAILED-FRAPPE-PURCHASE-INVOICE', '', Stringutil.jsonEncode(dataResult))
    }
}

export async function FailedAccurateJobPurchaseInvoice() {
    const service: AccurateService = new AccurateService
    const data = await service.getDataFailedPurchaseInvoice()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedAccurate, {
            taskQueue: 'accurate-sync-purchase-invoice',
            args: [],
            workflowId: 'job-sync-temporal-purchase-invoice-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        
        

        let dataResult = await handle.result()
        let result: ResponseWorkflow = {
            status: Object(dataResult).status,
            data:  Object(dataResult).data
        }
        
        service.log('JOB-FAILED-ACCURATE-PURCHASE-INVOICE', '', Stringutil.jsonEncode(result))
        service.log('result-workflow', 'job-accurate-sync', Stringutil.jsonEncode(result));
        if (result.status != 'success') {
            service.log('error-workflow', 'job-accurate-sync', Stringutil.jsonEncode(result));
            return
        }
        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            service.logAccurateSync(SyncType.PURCHASE_INVOICE ,dataAccurateFailed.purchase_invoice, Stringutil.jsonEncode(dataAccurateFailed));
        }

        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.PURCHASE_INVOICE, String(dataFrappeFailed.id_accurate), dataFrappeFailed.purchase_invoice, Stringutil.jsonEncode(dataFrappeFailed))
            
        }

        let responseData: ResponseProductSupllier = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        service.log('JOB-FAILED-ACCURATE-PURCHASE-INVOICE', '', Stringutil.jsonEncode(responseData))
    }
}
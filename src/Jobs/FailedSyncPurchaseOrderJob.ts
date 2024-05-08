import { ResponseWorkflow } from "../Controllers/Accurate/AccurateInterface";
import AccurateService from "../Services/AccurateService";
import FrappeService from "../Services/FrappeService";
import LogSyncService from "../Services/LogSyncService";
import Temporal from "../Temporal/Connections/Temporal";
import { syncFailedAccurate, syncFailedFrappe } from "../Temporal/PurchasingOrder/workflows";
import { SyncType } from "../Utils/EnumUtil";
import Stringutil from "../Utils/StringUtil";

export const FailedFrappeJobPurchaseOrder = async () => {
    const service: FrappeService = new FrappeService
    const data = await service.getDataFailedPruchaseOrder()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedFrappe, {
            taskQueue: 'accurate-sync-purchasing-order',
            args: [],
            workflowId: 'job-sync-temporal-purchase-order-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        let dataResult = await handle.result()
        service.log('JOB-FAILED-FRAPPE-PURCHASE-ORDER', '', Stringutil.jsonEncode(dataResult))
    }
}
export const FailedAccurateJobPurchaseOrder = async () => {
    const service: AccurateService = new AccurateService
    const data = await service.getDataFailedPurchaseOrder()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedAccurate, {
            taskQueue: 'accurate-sync-purchasing-order',
            args: [],
            workflowId: 'job-sync-temporal-purchase-order-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });

        let dataResult = await handle.result()
        let result: ResponseWorkflow = {
            status: Object(dataResult).status,
            data:  Object(dataResult).data
        }
        
        service.log('result-workflow', 'job-accurate-sync', Stringutil.jsonEncode(result));
        if (result.status != 'success') {
            service.log('error-workflow', 'job-accurate-sync', Stringutil.jsonEncode(result));
            return
        }

        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            service.logAccurateSync(SyncType.PURCHASE_ORDER ,dataAccurateFailed.id_purchase_order, Stringutil.jsonEncode(dataAccurateFailed));
        }

        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.PURCHASE_ORDER, String(dataFrappeFailed.id_accurate), dataFrappeFailed.id_purchase_order, Stringutil.jsonEncode(dataFrappeFailed))
            
        }

        let responseData = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        service.log('JOB-FAILED-ACCURATE-PURCHASE-ORDER', '', Stringutil.jsonEncode(responseData))
    }
}
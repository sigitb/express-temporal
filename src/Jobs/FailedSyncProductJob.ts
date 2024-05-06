import AccurateService from "../Services/AccurateService"
import FrappeService from "../Services/FrappeService"
import LogSyncService from "../Services/LogSyncService"
import Temporal from "../Temporal/Connections/Temporal"
import { syncFailedAccurate, syncFailedFrappe } from "../Temporal/Product/workflows"
import { SyncType } from "../Utils/EnumUtil"
import Stringutil from "../Utils/StringUtil"

export const FailedFrappeJobProduct = async () => {
    const service: FrappeService = new FrappeService
    const data = await service.getDataFailedProduct()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedFrappe, {
            taskQueue: 'sync-accurate-product',
            args: [],
            workflowId: 'job-workflow-sync-temporal-product-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        let dataResult = await handle.result()
        service.log('JOB-FAILED-FRAPPE-PRODUCT', '', Stringutil.jsonEncode(dataResult))
    }
}

export const FailedAccurateJobProduct = async () => {
    const serviceData: AccurateService = new AccurateService
    const data = await serviceData.getDataFailedProduct()
    
    if (data.length > 0) { 
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedAccurate, {
            taskQueue: 'sync-accurate-product',
            args: [],
            workflowId: 'job-workflow-sync-temporal-product-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        
        let dataResult = await handle.result()
        let result = {
            status: Object(dataResult).status,
            data:  Object(dataResult).data
        }
        
        if (result.status != 'success') {
            return
        }
    
        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            service.logAccurateSync(SyncType.PRODUCT ,dataAccurateFailed.name, Stringutil.jsonEncode(dataAccurateFailed));
        }
    
        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.PRODUCT,String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, Stringutil.jsonEncode(dataFrappeFailed))
            
        }
    
        let responseData = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        service.log('JOB-FAILED-ACCURATE-PRODUCT', '', Stringutil.jsonEncode(responseData))
    }

}
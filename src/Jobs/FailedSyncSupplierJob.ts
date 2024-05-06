import AccurateService from "../Services/AccurateService";
import FrappeService from "../Services/FrappeService";
import LogSyncService from "../Services/LogSyncService";
import Temporal from "../Temporal/Connections/Temporal";
import { syncFailedAccurate, syncFailedFrappe } from "../Temporal/Supplier/workflows";
import { SyncType } from "../Utils/EnumUtil";
import Stringutil from "../Utils/StringUtil";

export const FailedFrappeJobSupplier = async () => {
    const service: FrappeService = new FrappeService
    const data = await service.getDataFailedSupplier()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedFrappe, {
            taskQueue: 'sync-accurate-supplier',
            args: [],
            workflowId: 'job-workflow-sync-temporal-supplier-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        let dataResult = await handle.result()
        service.log('JOB-FAILED-FRAPPE-SUPPLIER', '', Stringutil.jsonEncode(dataResult))
    }
}

export const FailedAccurateJobSupplier = async () => {
    const serviceData: AccurateService = new AccurateService
    const data = await serviceData.getDataFailedSupplier()
    
    if (data.length > 0) { 
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncFailedAccurate, {
            taskQueue: 'sync-accurate-supplier',
            args: [],
            workflowId: 'job-workflow-sync-temporal-supplier-' + Stringutil.generateRandomString(7),
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
            service.logAccurateSync(SyncType.SUPPLIER ,dataAccurateFailed.name, Stringutil.jsonEncode(dataAccurateFailed));
        }
    
        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.SUPPLIER,String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, Stringutil.jsonEncode(dataFrappeFailed))
            
        }
    
        let responseData = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        service.log('JOB-FAILED-ACCURATE-SUPPLIER', '', Stringutil.jsonEncode(responseData))
    }

}
import FrappeService from "../Services/FrappeService";
import LogSyncService from "../Services/LogSyncService";
import Temporal from "../Temporal/Connections/Temporal";
import { syncFailedFrappe } from "../Temporal/PurchasingOrder/workflows";
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
import FrappeService from "../Services/FrappeService";
import LogSyncService from "../Services/LogSyncService";
import Temporal from "../Temporal/Connections/Temporal";
import Stringutil from "../Utils/StringUtil";

export const FailedFrappeJobProduct = async () => {
    const service: FrappeService = new FrappeService
    const data = await service.getDataFailedProduct()
    
    if (data.length > 0) {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start("re", {
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
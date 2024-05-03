import { Request, response, Response } from "express";
import LogSyncService from '../../Services/LogSyncService'
import Stringutil from "../../Utils/StringUtil";
import Temporal from "../../Temporal/Connections/Temporal";
import { syncAccurate } from "../../Temporal/Product/workflows";
import { ResponseProductSupllier, ResponseWorkflow } from "./AccurateInterface";
import { SyncType } from "../../Utils/EnumUtil";
import { syncAccurateSupplier } from "../../Temporal/Supplier/workflows";
import { getDataFailed } from "../../Temporal/PurchasingOrder/workflows";
import axios from "axios";
import { generateHeader } from "../../Utils/HeaderAccurateUtil";



class AccurateController {
    purchasingOrder = async (req: Request, res: Response): Promise<Response> => {
        // const objectResponse = {
        //     'data': 'siap mantap',
        //     'message': 'ok',
        //     'status':200
        // }
        // const objectRequest = {
        //     "name": "testing",
        //     "id": 1
        // }
        // const service: LogSyncService = new LogSyncService()

        // service.log('Success', Stringutil.jsonEncode(objectRequest), Stringutil.jsonEncode(objectResponse));

        // return res.send({
        //     data: objectResponse,
        //     message: "purchasing order",
        //     status:200
        // });

        const client = await Temporal.client();
        const handle = await client.workflow.start(getDataFailed, {
            taskQueue: 'accurate-sync-purchasing-order',
            args: [],
            workflowId: 'workflow-sync-temporal-purchasing-order-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        
        let dataResult = await handle.result()
        return res.send({
            message: "Sync",
            status: 200,
            data: dataResult
        });
    }

    product = async (req:Request, res: Response): Promise<Response> => {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncAccurate, {
            taskQueue: 'sync-accurate-product',
            args: [],
            workflowId: 'workflow-sync-temporal-product-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        
        let dataResult = await handle.result()
        let result: ResponseWorkflow = {
            status: Object(dataResult).status,
            data:  Object(dataResult).data
        }
        
        service.log('result-workflow', req.body.toString(), Stringutil.jsonEncode(result));
        if (result.status != 'success') {
            service.log('error-workflow', req.body.toString(), Stringutil.jsonEncode(result));
            return res.send({
                message: "Sync-failed",
                status: 200,
                data: {}
            });
        }

        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            service.logAccurateSync(SyncType.PRODUCT ,dataAccurateFailed.name, Stringutil.jsonEncode(dataAccurateFailed));
        }

        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.PRODUCT,String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, Stringutil.jsonEncode(dataFrappeFailed))
            
        }

        let responseData: ResponseProductSupllier = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        
        return res.send({
            message: "Sync",
            status: 200,
            data: responseData
        });
    }

    supplier = async (req: Request, res: Response): Promise<Response> => {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncAccurateSupplier, {
            taskQueue: 'sync-accurate-supplier',
            args: [],
            workflowId: 'workflow-sync-temporal-supplier-' + Stringutil.generateRandomString(7),
            workflowTaskTimeout: '1m',
            workflowRunTimeout: '1m',
        });
        
        let dataResult = await handle.result()
        let result: ResponseWorkflow = {
            status: Object(dataResult).status,
            data:  Object(dataResult).data
        }
        
        service.log('result-workflow', req.body.toString(), Stringutil.jsonEncode(result));
        if (result.status != 'success') {
            service.log('error-workflow', req.body.toString(), Stringutil.jsonEncode(result));
            return res.send({
                message: "Sync-failed",
                status: 200,
                data: {}
            });
        }

        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            console.log(dataAccurateFailed);
            service.logAccurateSync(SyncType.SUPPLIER ,dataAccurateFailed.name, Stringutil.jsonEncode(dataAccurateFailed));
        }

        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            console.log(dataFrappeFailed);
            
            service.logFrappeSync(SyncType.SUPPLIER,String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, Stringutil.jsonEncode(dataFrappeFailed))
            
        }

        let responseData: ResponseProductSupllier = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        
        return res.send({
            message: "Sync",
            status: 200,
            data: responseData
        });
    }

    getDatabaseAccurate = async (req: Request, res: Response): Promise<Response> => {
        const headers: { [key: string]: string } = generateHeader();
        const response = await axios.post('https://account.accurate.id/api/api-token.do', {}, { headers })
        return res.send({
            message: "database",
            status: 200,
            data: response.data
        })
    }
}

export default new AccurateController();
import { Request, response, Response } from "express";
import LogSyncService from '../../Services/LogSyncService'
import Stringutil from "../../Utils/StringUtil";
import Temporal from "../../Temporal/Connections/Temporal";
import { syncAccurate } from "../../Temporal/Product/workflows";
import { ResponseProductSupllier, ResponseWorkflow } from "./AccurateInterface";
import { SyncType } from "../../Utils/EnumUtil";
import { syncAccurateSupplier } from "../../Temporal/Supplier/workflows";
import { syncAccuratePurchaseOrder  } from "../../Temporal/PurchasingOrder/workflows";
import { syncPurhcaseInvoice } from "../../Temporal/PurchaseInvoice/workflows";
import axios from "axios";
import { generateHeader } from "../../Utils/HeaderAccurateUtil";
import ResponseUtil from "../../Utils/ResponseUtil";



class AccurateController {
    purchasingOrder = async (req: Request, res: Response): Promise<Response> => {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncAccuratePurchaseOrder, {
            taskQueue: 'accurate-sync-purchasing-order',
            args: [],
            workflowId: 'workflow-sync-purchase-order-' + Stringutil.generateRandomString(7),
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
            const formatter = ResponseUtil.response('failed', 400, 'Synchronization Purchase Order Failed')
            return res.send(formatter)
        }

        for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
            let dataAccurateFailed = result.data.sync_accurate_error[index] 
            service.logAccurateSync(SyncType.PURCHASE_ORDER ,dataAccurateFailed.id_purchase_order, Stringutil.jsonEncode(dataAccurateFailed));
        }

        for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
            let dataFrappeFailed = result.data.sync_frappe_error[index]
            
            service.logFrappeSync(SyncType.PURCHASE_ORDER, String(dataFrappeFailed.id_accurate), dataFrappeFailed.id_purchase_order, Stringutil.jsonEncode(dataFrappeFailed))
            
        }

        let responseData: ResponseProductSupllier = {
            data_accurate_error: result.data.sync_accurate_error,
            data_accurate_success: result.data.sync_accurate_success,
            data_frappe_error: result.data.sync_frappe_error,
            data_frappe_success:result.data.sync_frappe_success
        };
        
        
        const formatter = ResponseUtil.response('success', 200, 'Synchronization Purchase Order Successfuly', responseData)
        return res.send(formatter)
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
            const formatter = ResponseUtil.response('failed', 400, 'Synchronization Product Failed')
            return res.send(formatter)
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
        
        
        const formatter = ResponseUtil.response('success', 200, 'Synchronization Product Successfuly', responseData)
        return res.send(formatter)
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
            const formatter = ResponseUtil.response('failed', 400, 'Synchronization Supplier Failed')
            return res.send(formatter)
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
        
        const formatter = ResponseUtil.response('success', 200, 'Synchronization Supplier Successfuly', responseData)
        return res.send(formatter)
    }

    purchaseInvoce = async (req: Request, res: Response): Promise<Response> => {
        const service: LogSyncService = new LogSyncService()
        const client = await Temporal.client();
        const handle = await client.workflow.start(syncPurhcaseInvoice, {
            taskQueue: 'accurate-sync-purchase-invoice',
            args: [],
            workflowId: 'workflow-sync-purchase-invoice-' + Stringutil.generateRandomString(7),
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
            const formatter = ResponseUtil.response('failed', 400, 'Synchronization Purchase Invoice Failed')
            return res.send(formatter)
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
        
        
        const formatter = ResponseUtil.response('success', 200, 'Synchronization Purchase Invoice Successfuly', responseData)
        return res.send(formatter)
    }

    getDatabaseAccurate = async (req: Request, res: Response): Promise<Response> => {
        const headers: { [key: string]: string } = generateHeader();
        const response = await axios.post('https://account.accurate.id/api/api-token.do', {}, { headers })
        // const response = await axios.post(process.env.ACCURATE_HOST + '/accurate/api/purchase-invoice/save.do', {
        //     'transDate': '08/05/2024',
        //     'vendorNo': 'V.00002',
        //     'billNumber': 'PO.2024.05.00009',
        //     'detailItem': [{
        //         'itemId': '100',
        //         'unitPrice': 20000,
        //         'itemUnitName': "PCS",
        //         'quantity': 200
        //     }]
        // } ,{headers})
        const formatter = ResponseUtil.response('success', 200, 'berhasil')
        return res.send(formatter)
    }
}

export default new AccurateController();
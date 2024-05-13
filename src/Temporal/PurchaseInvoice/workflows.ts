import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { DataCron, FailedData, Item, PurchaseInvoice, ResponseWorkflow } from './workflowInterface';
import { format } from 'date-fns';

const {
  callInvoice,
  updateId,
  sync,
  callFailedFrappe,
  deleteFailedFrappe
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  scheduleToCloseTimeout: '30s',
});

export async function syncPurhcaseInvoice(): Promise<Object> {
    try {
        const responseInvoice = await callInvoice();
        let purchaseinvoice = Object(responseInvoice)
        if (purchaseinvoice.status != 'success') {
          return {
            'status': 'error',
            'data':{}
          }
        }
        let response: ResponseWorkflow = {
          sync_accurate_error: [],
          sync_accurate_success: [],
          sync_frappe_error: [],
          sync_frappe_success: [],
        };

        for (let index = 0; index < purchaseinvoice.data.length; index++) {
          const products: Item[] = purchaseinvoice.data[index].items
            const data: PurchaseInvoice = {
                purchase_invoice: purchaseinvoice.data[index].id_purchase_invoice,
                purchase_order: purchaseinvoice.data[index].id_po_accurate,
                supplier: purchaseinvoice.data[index].id_supplier_accurate,
                transaction_date:  format(new Date(purchaseinvoice.data[index].posting_date), 'dd/MM/yyyy'),
                items: products
            }
          
            const syncPurchaseInvoice = await sync(data)
            const resultSyncPurchaseInvoice = Object(syncPurchaseInvoice)
            if (resultSyncPurchaseInvoice.status != 'success') {
              response.sync_accurate_error.push(data);
              continue;
            } else {
              data.id_accurate = resultSyncPurchaseInvoice.data.r.number;
              response.sync_accurate_success.push(data);
            }
            
            const updateProduct = await updateId(String(data.purchase_invoice), resultSyncPurchaseInvoice.data.r.number || 0) 
            const resultUpdateProduct = Object(updateProduct)
            if (resultUpdateProduct.status != 'success') {
              response.sync_frappe_error.push(data);
              continue;
            } else {
              response.sync_frappe_success.push(data);
            }
        }
        return {
          status: 'success',
          data: response
        }
    } catch (error) {
        return {
            status: 'error',
            data: error
        }
    }
}

export async function syncFailedFrappe(): Promise<Object> {

  try {
    const failedSync = await callFailedFrappe();
    let resultFailedSync = Object(failedSync)
    if (resultFailedSync.status != 'success') {
      return {
        'status': 'error',
        'data':{}
      }
    }

    const result: DataCron = {
      sync_failed: [],
      sync_success:[]
    }

    for (let index = 0; index < resultFailedSync.data.length; index++) {
      const purchase_invoince: FailedData = {
        id: resultFailedSync.data[index].id,
        id_accurate: resultFailedSync.data[index].id_accurate,
        id_frappe: resultFailedSync.data[index].id_frappe,
      }
      const updateDataFailed = await updateId(purchase_invoince.id_accurate, purchase_invoince.id_frappe);
      let updateData = Object(updateDataFailed)
      if (updateData.status != 'success') {
        result.sync_failed.push(purchase_invoince)
        continue;
      }
      
      await deleteFailedFrappe(purchase_invoince.id)
      result.sync_success.push(purchase_invoince)
    }
    return {
      status: "success",
      data: result
    }
  } catch (error) {
    return {
      status: "error",
      data:error
    }
  }
  
}
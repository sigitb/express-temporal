import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { Item, PurchaseInvoice, ResponseWorkflow } from './workflowInterface';
import { format } from 'date-fns';

const {
  callInvoice,
  updateId,
  sync,
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

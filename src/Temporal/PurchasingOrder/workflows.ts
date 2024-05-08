import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { format } from 'date-fns';
import { Item, PurchaseOrder, Response } from './workflowInterface';

const {
  callPurchaseOrder,
  updateId,
  sync
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  scheduleToCloseTimeout: '30s',
});



/** A workflow that simply calls an activity */
export async function syncAccuratePurchaseOrder(): Promise<Object> {
  try {
    const resultPurchaseOrder = await callPurchaseOrder();
    let purchaseOrder = Object(resultPurchaseOrder)
    if (purchaseOrder.status != 'success') {
      return {
        'status': 'error',
        'data':{}
      }
    }
    let response: Response = {
      sync_accurate_error: [],
      sync_accurate_success: [],
      sync_frappe_error: [],
      sync_frappe_success: [],
    };

    for (let index = 0; index < purchaseOrder.data.length; index++) {
      const products: Item[] = purchaseOrder.data[index].items

      const row: PurchaseOrder = {
        id_purchase_order: purchaseOrder.data[index].id_purchasing_order,
        id_supplier: purchaseOrder.data[index].id_supplier,
        id_supplier_accurate: purchaseOrder.data[index].id_accurate_supplier,
        address: purchaseOrder.data[index].address,
        grand_total: purchaseOrder.data[index].grand_total,
        transaction_date: format(new Date(purchaseOrder.data[index].transaction_date), 'dd/MM/yyyy'),
        items: products
      }      

      const syncPurchaseOrder = await sync(row)
      const resultSyncPurchaseOrder = Object(syncPurchaseOrder)
      if (resultSyncPurchaseOrder.status != 'success') {
        response.sync_accurate_error.push(row);
        continue;
      } else {
        row.id_accurate = resultSyncPurchaseOrder.data.r.vendorNo;
        response.sync_accurate_success.push(row);
      }

      const updateProduct = await updateId(String(row.id_purchase_order), resultSyncPurchaseOrder.data.r.vendorNo) 
      const resultUpdateProduct = Object(updateProduct)
      if (resultUpdateProduct.status != 'success') {
        response.sync_frappe_error.push(row);
        continue;
      } else {
        response.sync_frappe_success.push(row);
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
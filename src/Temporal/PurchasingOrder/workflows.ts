import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { format } from 'date-fns';
import { DataCron, FailedData, Item, PurchaseOrder, Response } from './workflowInterface';

const {
  callPurchaseOrder,
  updateId,
  sync,
  callFailedFrappe,
  deleteFailedFrappe,
  callFailedAccurate,
  deleteFailedAccurate
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
        row.id_accurate = resultSyncPurchaseOrder.data.r.number;
        response.sync_accurate_success.push(row);
      }

      const updateProduct = await updateId(String(row.id_purchase_order), resultSyncPurchaseOrder.data.r.number || 0) 
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
      const purchase_order: FailedData = {
        id: resultFailedSync.data[index].id,
        id_accurate: resultFailedSync.data[index].id_accurate,
        id_frappe: resultFailedSync.data[index].id_frappe,
      }
      const updateDataFailed = await updateId(purchase_order.id_accurate, purchase_order.id_frappe);
      let updateData = Object(updateDataFailed)
      if (updateData.status != 'success') {
        result.sync_failed.push(purchase_order)
        continue;
      }
      
      await deleteFailedFrappe(purchase_order.id)
      result.sync_success.push(purchase_order)
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

export async function syncFailedAccurate(): Promise<Object> {
  try {
    const callFailedData = await callFailedAccurate()
    let resultFailedData = Object(callFailedData)
    if (resultFailedData.status != 'success') {
      return {
        'status': 'error',
        'data': resultFailedData.data
      }
    }

    let response: Response = {
      sync_accurate_error: [],
      sync_accurate_success: [],
      sync_frappe_error: [],
      sync_frappe_success: [],
    };

    for (let index = 0; index < resultFailedData.data.length; index++) {
      const products: Item[] = resultFailedData.data[index].items

      const row: PurchaseOrder = {
        id: resultFailedData.data[index].id,
        id_purchase_order: resultFailedData.data[index].id_purchase_order,
        id_supplier: resultFailedData.data[index].id_supplier,
        id_supplier_accurate: resultFailedData.data[index].id_supplier_accurate,
        address: resultFailedData.data[index].address,
        grand_total: resultFailedData.data[index].grand_total,
        transaction_date: format(new Date(resultFailedData.data[index].transaction_date), 'dd/MM/yyyy'),
        items: products
      }

      const deleteData = await deleteFailedAccurate(row.id || 0)
      const resultDelete = Object(deleteData)
      if (resultDelete.status != 'success') {
        continue;
      }

      const syncPurchaseOrder = await sync(row)
      const resultSyncPurchaseOrder = Object(syncPurchaseOrder)
      if (resultSyncPurchaseOrder.status != 'success') {
        response.sync_accurate_error.push(row);
        continue;
      } else {
        row.id_accurate = resultSyncPurchaseOrder.data.r.number;
        response.sync_accurate_success.push(row);
      }

      const updateProduct = await updateId(String(row.id_purchase_order), resultSyncPurchaseOrder.data.r.number || 0)
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
      status: "error",
      data: error
    }
  }
}
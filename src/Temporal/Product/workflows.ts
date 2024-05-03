import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { Data, DataCron, FailedData, Product } from './workflowInterface'

const {
  callProducts,
  syncProducts,
  updateIdAccurate,
  callFailedSyncFrappe,
  deleteDataFailedFrappe,
  callFailedSyncAccurate,
  deleteDataFailedAccurate
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  scheduleToCloseTimeout: '30s',
});



/** A workflow that simply calls an activity */
export async function syncAccurate(): Promise<Object> {
  try {
    const resultProducts = await callProducts();
    let products = Object(resultProducts)
    if (products.status != 'success') {
      return {
        'status': 'error',
        'data':{}
      }
    }
    let data: Data = {
      sync_accurate_error: [],
      sync_accurate_success: [],
      sync_frappe_error: [],
      sync_frappe_success: [],
    };

    for (let index = 0; index < products.data.length; index++) {
      const syncProduct = await syncProducts(products.data[index].item_name);
      const resultProduct = Object(syncProduct)
      let product: Product = {
        id: products.data[index].name,
        name: products.data[index].item_name,
      }
      if (resultProduct.status != 'success') {
        data.sync_accurate_error.push(product);
        await updateIdAccurate(product.id, 0) 
        continue;
      } else {
        data.sync_accurate_success.push(product);
      }
      
      const updateProduct = await updateIdAccurate(product.id, resultProduct.data.r.id) 
      const resultUpdateProduct = Object(updateProduct)
      if (resultUpdateProduct.status != 'success') {
        product.id_accurate = resultProduct.data.r.id;
        data.sync_frappe_error.push(product);
        continue;
      } else {
        data.sync_frappe_success.push(product);
      }

    }

    return {
      status: 'success',
      data: data
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
    const resultDataFailed = await callFailedSyncFrappe()
    let failedData = Object(resultDataFailed)
    if (failedData.status != 'success') {
      return {
        'status': 'error',
        'data':{}
      }
    }

    const result: DataCron = {
      sync_failed: [],
      sync_success:[]
    }

    for (let index = 0; index < failedData.data.length; index++) {
      const product: FailedData = {
        id: failedData.data[index].id,
        id_accurate: failedData.data[index].id_accurate,
        id_frappe: failedData.data[index].id_frappe,
      }
      const updateDataFailed = await updateIdAccurate(product.id_frappe, product.id_accurate);
      let updateData = Object(updateDataFailed)
      if (updateData.status != 'success') {
        result.sync_failed.push(product)
        continue;
      }
      
      await deleteDataFailedFrappe(product.id)
      result.sync_success.push(product)
    }

    return {
      status: 'success',
      data: result
    }

  } catch (error) {
    return {
      status: 'error',
      data: error
    }
  }
}

export async function syncFailedAccurate(): Promise<Object> {
  try {
    const resultDataFailed = await callFailedSyncAccurate()
    let failedData = Object(resultDataFailed)
    if (failedData.status != 'success') {
      return {
        'status': 'error',
        'data':{}
      }
    }

    let data: Data = {
      sync_accurate_error: [],
      sync_accurate_success: [],
      sync_frappe_error: [],
      sync_frappe_success: [],
    };

    for (let index = 0; index < failedData.data.length; index++) {
      const product: Product = {
        id: failedData.data[index].id,
        name: failedData.data[index].name,
        id_frappe: failedData.data[index].id_frappe
      }

      const deleteData = await deleteDataFailedAccurate(parseInt(product.id))
      const resultDelete = Object(deleteData)
      if (resultDelete.status != 'success') {
        continue;
      }

      const syncProduct = await syncProducts(product.name);
      const resultProduct = Object(syncProduct)
      if (resultProduct.status != 'success') {
        data.sync_accurate_error.push(product);
        continue;
      } else {
        data.sync_accurate_success.push(product);
      }
      const updateProduct = await updateIdAccurate(product.id_frappe || '', resultProduct.data.r.id) 
      const resultUpdateProduct = Object(updateProduct)
      if (resultUpdateProduct.status != 'success') {
        product.id_accurate = resultProduct.data.r.id;
        data.sync_frappe_error.push(product);
        continue;
      } else {
        data.sync_frappe_success.push(product);
      }
    }

    return {
      status: 'error',
      data:data
    }
  } catch (error) {
    return {
      status: 'error',
      data:error
    }
  }
}
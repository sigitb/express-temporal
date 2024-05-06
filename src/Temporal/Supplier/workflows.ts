import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { Data, DataCron, FailedData, Supplier } from './workflowInterface'
import { format } from 'date-fns';

const {
  callSupplier,
  syncSupplier,
  updateIdSupplier,
  callFailedSyncAccurate,
  callFailedSyncFrappe,
  deleteDataFailedAccurate,
  deleteDataFailedFrappe
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  scheduleToCloseTimeout: '30s',
});



/** A workflow that simply calls an activity */
export async function syncAccurateSupplier(): Promise<Object> {
  try {
    const resultSuppliers = await callSupplier();
    let suppliers = Object(resultSuppliers)
    if (suppliers.status != 'success') {
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

    for (let index = 0; index < suppliers.data.length; index++) {
      const syncSuppliers = await syncSupplier(suppliers.data[index].name, format(new Date(suppliers.data[index].creation), 'dd/MM/yyyy'));
      const resultSuppliers = Object(syncSuppliers)
      let supplier: Supplier = {
        id: suppliers.data[index].name,
        name: suppliers.data[index].supplier_name,
        join_date: format(new Date(suppliers.data[index].creation), 'dd/MM/yyyy')
      }
      if (resultSuppliers.status != 'success') {
        data.sync_accurate_error.push(supplier);
        await updateIdSupplier(0, supplier.id) 
        continue;
      } else {
        data.sync_accurate_success.push(supplier);
      }
      
      const updateSupplier = await updateIdSupplier(resultSuppliers.data.r.id, supplier.id) 
      const resultUpdateSupplier = Object(updateSupplier)
      if (resultUpdateSupplier.status != 'success') {
        supplier.id_accurate = resultSuppliers.data.r.id;
        data.sync_frappe_error.push(supplier);
      } else {
        data.sync_frappe_success.push(supplier);
      }

    }

    return {
      'status': 'success',
      'data': data
    }
  } catch (error) {
    return {
      'status': 'error',
      'data': error
    }
  }
}

export async function syncFailedFrappe(): Promise<Object> {
  try {
    const resultFailedData = await callFailedSyncFrappe()
    let failedData = Object(resultFailedData)
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
      const supplier: FailedData = {
        id: failedData.data[index].id,
        id_accurate: failedData.data[index].id_accurate,
        id_frappe: failedData.data[index].id_frappe,
      }
      const updateDataFailed = await updateIdSupplier(supplier.id_accurate, supplier.id_frappe);
      let updateData = Object(updateDataFailed)
      if (updateData.status != 'success') {
        result.sync_failed.push(supplier)
        continue;
      }
      
      await deleteDataFailedFrappe(supplier.id)
      result.sync_success.push(supplier)
    }

    return {
      status: 'success',
      data: result
    }

  } catch (error) {
    return {
      status: 'error',
      data:error
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
      const supplier: Supplier = {
        id: failedData.data[index].id,
        name: failedData.data[index].name,
        id_frappe: failedData.data[index].id_frappe,
        join_date: failedData.data[index].join_date
      }

      const deleteData = await deleteDataFailedAccurate(parseInt(supplier.id))
      const resultDelete = Object(deleteData)
      if (resultDelete.status != 'success') {
        continue;
      }
      if (supplier.join_date == '') {
        supplier.join_date = Date.now().toString()
      }
      const syncFailedSupplier = await syncSupplier(supplier.name, format(new Date(supplier.join_date), 'dd/MM/yyyy'));
      const resultSuppSyncSupplier = Object(syncFailedSupplier)
      if (resultSuppSyncSupplier.status != 'success') {
        data.sync_accurate_error.push(supplier);
        continue;
      } else {
        data.sync_accurate_success.push(supplier);
      }
      const updateProduct = await updateIdSupplier(resultSuppSyncSupplier.data.r.id, supplier.id_frappe || '') 
      const resultUpdateProduct = Object(updateProduct)
      if (resultUpdateProduct.status != 'success') {
        supplier.id_accurate = resultSuppSyncSupplier.data.r.id;
        data.sync_frappe_error.push(supplier);
        continue;
      } else {
        data.sync_frappe_success.push(supplier);
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
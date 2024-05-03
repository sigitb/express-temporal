import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { Data, Supplier } from './workflowInterface'
import { format } from 'date-fns';

const {callSupplier, syncSupplier, updateIdSupplier } = proxyActivities<typeof activities>({
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
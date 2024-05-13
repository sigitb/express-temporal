import axios from 'axios';
import { generateHeader } from '../../Utils/HeaderAccurateUtil'
import Stringutil from '../../Utils/StringUtil';
import { PurchaseInvoice } from './workflowInterface';
import FrappeService from '../../Services/FrappeService';
require("dotenv").config();

export async function callInvoice(): Promise<Object> {
    try {
        const response = await axios.get(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.PurchaseInvoice', {
          headers: {
            'Authorization': 'token 736960728528a1c:4d043b927a0449d'
          }
        })
        return {
          status: 'success',
          data: response.data.message
        }
      } catch (error) {
        return {
          status: 'error',
          message: error,
          data:[]
        }
      }
}

export async function sync(data:PurchaseInvoice): Promise<Object> {
    try {
        const headers: { [key: string]: string } = generateHeader();
        const response = await axios.post(process.env.ACCURATE_HOST + '/accurate/api/purchase-invoice/save.do', {
            'transDate': data.transaction_date,
            'vendorNo': data.supplier,
            'billNumber': data.purchase_order,
            'detailItem': data.items?.map(row => {
                return {
                    'itemId': row.id,
                    'unitPrice': row.price,
                    'itemUnitName': "PCS",
                    'quantity': row.quantity
                };
            })
        }, { headers })
        return {
          status: 'success',
          data:response.data
        }
      } catch (error) {
        return {
          status: 'error',
          data: error
        }
      }
}

export async function updateId(id: string, id_accurate: string | "0"): Promise<Object> {
    try {
      const response = await axios.put(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.UpdatePurchaseInvoice', {
        'accurate': id_accurate,
        'id_frappe': id
      }, {
        headers: {
          'Authorization': 'token 736960728528a1c:4d043b927a0449d'
        }
      })

      if (response.data.message.status == 'error') {
        return {
          status: 'error',
          data: response.data.message
        }
      }

      return {
        status: 'success',
        data:response.data
      }
    } catch (error) {
      return {
        status: 'error',
        data: error
      }
    }
}

export async function callFailedFrappe(): Promise<Object> {
  try {
    const service: FrappeService = new FrappeService
    const result = await service.getDataFailedPruchaseInvoice()    
    return {
      status: "success",
      data: result
    }
  } catch (error) {
    return {
      status: 'error',
      data: error
    }
  }
}

export async function deleteFailedFrappe(id:number): Promise<Object> {
  try {
    const service: FrappeService = new FrappeService
    const result = await service.deleteDataFailed(id)    
    return {
      status: "success",
      data: result
    }
    return {}
  } catch (error) {
    return {
      status: 'error',
      data: error
    }
  }
}

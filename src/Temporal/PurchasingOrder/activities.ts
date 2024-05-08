import axios from "axios"
import { PurchaseOrder } from "./workflowInterface"
import { generateHeader } from "../../Utils/HeaderAccurateUtil"

export async function callPurchaseOrder(): Promise<Object> {
    try {
        const response = await axios.get(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.PurchasingOrder', {
            headers: {
              'Authorization': 'token 736960728528a1c:4d043b927a0449d'
            }
          })
          return {
            status: 'success',
            data:response.data.message
        }
        
    } catch (error) {
        return {
            status: 'error',
            data: error
        }
    }
}

export async function sync(data: PurchaseOrder) : Promise<Object> {
    try {
        const headers: { [key: string]: string } = generateHeader();
        const response = await axios.post(process.env.ACCURATE_HOST + '/accurate/api/purchase-order/save.do', {
            'transDate': data.transaction_date,
            'vendorNo': data.id_supplier_accurate,
            'toAddress': data.address,
            'rate': data.grand_total,
            'detailItem': data.items?.map(row => {
                return {
                    'itemId': row.id_accurate,
                    'unitPrice': row.rate,
                    'itemUnitName': "PCS",
                    'quantity': row.qty
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

export async function updateId(id: string, id_accurate: string | ""): Promise<Object> {
    try {
      const response = await axios.put(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.UpdatePurchaseOrder', {
        'accurate': id_accurate,
        'id_frappe': id
      }, {
        headers: {
          'Authorization': 'token 736960728528a1c:4d043b927a0449d'
        }
      })
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
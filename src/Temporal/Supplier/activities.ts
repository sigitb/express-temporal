import axios from 'axios';
import { generateHeader } from '../../Utils/HeaderAccurateUtil'
require("dotenv").config();

export async function callSupplier(): Promise<Object> {
    try {
      const response = await axios.get(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.SupplierAll', {
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
          message: error,
          data:[]
        }
      }
}

export async function syncSupplier(name:string, join_date:string): Promise<Object> {
    try {
        const headers: { [key: string]: string } = generateHeader();
        const response = await axios.post(process.env.ACCURATE_HOST + '/accurate/api/vendor/save.do', {
            'transDate': join_date,
            'name': name,
         }, {headers})
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

export async function updateIdSupplier(accurate: number | 0, frappe:string) : Promise<Object> {
  try {
    const response = await axios.put(process.env.FRAPPE_HOST + '/api/resource/Supplier/' + frappe, {
      'id_accurate': accurate,
      'id_sync': 1
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
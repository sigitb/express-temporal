import axios from 'axios';
import { generateHeader } from '../../Utils/HeaderAccurateUtil'
import FrappeService from '../../Services/FrappeService';
import AccurateService from '../../Services/AccurateService';
import Stringutil from '../../Utils/StringUtil';
require("dotenv").config();

export async function callProducts(): Promise<Object> {
  try {
    const response = await axios.get(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.ProductAll', {
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

export async function syncProducts(name: String): Promise<Object> {
  try {
    const headers: { [key: string]: string } = generateHeader();
    const response = await axios.post(process.env.ACCURATE_HOST + '/accurate/api/item/save.do', {
        'itemType': 'INVENTORY',
        'name': name,
        'unit1Name':'PCS'
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

export async function updateIdAccurate(id: string, id_accurate: number | 0): Promise<Object> {
  try {
    const response = await axios.put(process.env.FRAPPE_HOST + '/api/resource/Item/' + id, {
      'id_accurate': id_accurate,
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

export async function callFailedSyncFrappe(): Promise<Object> {
  try {
    const service: FrappeService = new FrappeService
    const result = service.getDataFailedProduct()    
    return {
      status: "success",
      data: await result
    }
  } catch (error) {
    return {
      status: 'error',
      data: error
    }    
  }
}

export async function deleteDataFailedFrappe(id: number): Promise<Object> {
  try {
    const service: FrappeService = new FrappeService
    const result = service.deleteDataFailed(id)
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

export async function callFailedSyncAccurate(): Promise<Object> {
  try {
    const service: AccurateService = new AccurateService
    const result = await service.getDataFailedProduct()    
    return {
      status: "success",
      data: result.map(item => {
        const request = Stringutil.jsonDecode(item.request || '')
        return {
          ...item,
          id_frappe: request ? request.id : ''
      };
      })
    }
  } catch (error) {
    return {
      status: 'error',
      data: error
    }    
  }
}

export async function deleteDataFailedAccurate(id: number): Promise<Object> {
  try {
    const service: AccurateService = new AccurateService
    const result = service.deleteDataFailed(id)
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
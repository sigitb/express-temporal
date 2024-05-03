import FrappeService from "../../Services/FrappeService";
import LogSyncService from "../../Services/LogSyncService";

export async function greet(): Promise<any> {
    const service: FrappeService = new FrappeService()
    const data = service.getDataFailedProduct()
    return data
}
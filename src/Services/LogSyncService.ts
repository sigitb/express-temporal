import { Prisma, PrismaClient } from "@prisma/client";
import { SyncType } from "../Utils/EnumUtil";
const prisma = new PrismaClient();


class LogSyncService {

    log = async (nameRequest: string, requestBody: string, responseBody: string) => {
        const logSync = await prisma.logSync.create({
            data: {
                name: nameRequest,
                request: requestBody,
                response: responseBody
            }
        })
    }

    logAccurateSync = async (type_sync: SyncType, title: string, requestBody: string) => {
        const logSync = await prisma.syncAccurateFailed.create({
            data: {
                type: type_sync,
                name: title,
                request: requestBody
            }
        })
    }

    logFrappeSync = async (type_sync: SyncType,accurate: string, frappe: string, requestBody: string) => {
        const logSync = await prisma.syncFrappeFailed.create({
            data: {
                type: type_sync,
                id_accurate: accurate,
                id_frappe: frappe,
                request: requestBody
            }
        })
    }
}

export default LogSyncService;
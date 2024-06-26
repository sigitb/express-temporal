import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class FrappeService { 
    getDataFailedProduct = async () => {
        const data = await prisma.syncFrappeFailed.findMany({
            where: {
                type:'PRODUCT'
            },
            select: {
                id: true,
                id_accurate: true,
                id_frappe: true
            }
        })
        return data
    }
    getDataFailedSupplier = async () => {
        const data = await prisma.syncFrappeFailed.findMany({
            where: {
                type:'SUPPLIER'
            },
            select: {
                id: true,
                id_accurate: true,
                id_frappe: true
            }
        })
        return data
    }
    getDataFailedPruchaseOrder = async () => {
        const data = await prisma.syncFrappeFailed.findMany({
            where: {
                type:'PURCHASE_ORDER'
            },
            select: {
                id: true,
                id_accurate: true,
                id_frappe: true
            }
        })
        return data
    }
    getDataFailedPruchaseInvoice = async () => {
        const data = await prisma.syncFrappeFailed.findMany({
            where: {
                type:'PURCHASE_INVOICE'
            },
            select: {
                id: true,
                id_accurate: true,
                id_frappe: true
            }
        })
        return data
    }

    deleteDataFailed = async (id: number) => {
        const deleteData = await prisma.syncFrappeFailed.delete({
            where: {
                id: id
            }
        })
        return deleteData
    }
}

export default FrappeService
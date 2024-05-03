import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AccurateService { 
    getDataFailedProduct = async () => {
        const data = await prisma.syncAccurateFailed.findMany({
            where: {
                type:'PRODUCT'
            },
            select: {
                id: true,
                name: true,
                request:true
            }
        })
        return data
    }
    getDataFailedSupplier = async () => {
        const data = await prisma.syncAccurateFailed.findMany({
            where: {
                type:'SUPPLIER'
            },
            select: {
                id: true,
                name: true,
                request:true
            }
        })
        return data
    }

    deleteDataFailed = async (id: number) => {
        const deleteData = await prisma.syncAccurateFailed.delete({
            where: {
                id: id
            }
        })
        return deleteData
    }
}

export default AccurateService
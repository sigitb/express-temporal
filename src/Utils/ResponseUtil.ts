class ResponseUtil {
    public static authenticate = (): object => {
        const res = {
            meta: {
                status: 'error',
                code: 401,
                message: 'not authenticated'
            },
            data:{}
        };
        return res
    }

    public static response = (status: number, code:number, message:string, data: any): object => {
        const res = {
            meta: {
                status: status,
                code: code,
                message: message
            },
            data:data
        };
        return res
    }
}

export default ResponseUtil;
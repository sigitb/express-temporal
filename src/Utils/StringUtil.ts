class Stringutil {
    public static jsonEncode = (data: any): string => {
        const jsonString = JSON.stringify(data);
        return jsonString
    }

    public static jsonDecode = (data: string): any => {
        const json = JSON.parse(data);
        return json
    }

    public static generateRandomString = (length: number): string => {
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
        for (let i: number = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

export default Stringutil;
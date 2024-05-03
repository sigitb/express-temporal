"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stringutil {
}
Stringutil.jsonEncode = (data) => {
    const jsonString = JSON.stringify(data);
    return jsonString;
};
Stringutil.jsonDecode = (data) => {
    const json = JSON.parse(data);
    return json;
};
Stringutil.generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.default = Stringutil;

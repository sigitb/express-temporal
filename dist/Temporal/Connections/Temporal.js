"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@temporalio/client");
class temporalConnection {
    constructor() {
        this.client = () => __awaiter(this, void 0, void 0, function* () {
            const connection = yield client_1.Connection.connect({ address: process.env.URL_TEMPORAL });
            const client = new client_1.Client({
                connection,
                // namespace: 'foo.bar', // connects to 'default' namespace if not specified
            });
            return client;
        });
    }
}
exports.default = new temporalConnection();

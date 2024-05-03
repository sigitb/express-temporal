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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LogSyncService {
    constructor() {
        this.log = (nameRequest, requestBody, responseBody) => __awaiter(this, void 0, void 0, function* () {
            const logSync = yield prisma.logSync.create({
                data: {
                    name: nameRequest,
                    request: requestBody,
                    response: responseBody
                }
            });
        });
        this.logAccurateSync = (type_sync, title, requestBody) => __awaiter(this, void 0, void 0, function* () {
            const logSync = yield prisma.syncAccurateFailed.create({
                data: {
                    type: type_sync,
                    name: title,
                    request: requestBody
                }
            });
        });
        this.logFrappeSync = (type_sync, accurate, frappe, requestBody) => __awaiter(this, void 0, void 0, function* () {
            const logSync = yield prisma.syncFrappeFailed.create({
                data: {
                    type: type_sync,
                    id_accurate: accurate,
                    id_frappe: frappe,
                    request: requestBody
                }
            });
        });
    }
}
exports.default = LogSyncService;

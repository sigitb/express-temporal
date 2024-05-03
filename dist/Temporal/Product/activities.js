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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIdAccurate = exports.callCategory = exports.syncProducts = exports.callProducts = void 0;
const axios_1 = __importDefault(require("axios"));
const HeaderAccurateUtil_1 = require("../../Utils/HeaderAccurateUtil");
require("dotenv").config();
function callProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(process.env.FRAPPE_HOST + '/api/method/erpnext.api_v1.accurate.api.ProductAll', {
                headers: {
                    'Authorization': 'token 736960728528a1c:4d043b927a0449d'
                }
            });
            return {
                status: 'success',
                data: response.data.message
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error,
                data: []
            };
        }
    });
}
exports.callProducts = callProducts;
function syncProducts(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const headers = (0, HeaderAccurateUtil_1.generateHeader)();
            const response = yield axios_1.default.post(process.env.ACCURATE_HOST + '/accurate/api/item/save.do', {
                'itemType': 'INVENTORY',
                'name': name,
            }, { headers });
            return {
                status: 'success',
                data: response.data
            };
        }
        catch (error) {
            return {
                status: 'error',
                data: error
            };
        }
    });
}
exports.syncProducts = syncProducts;
function callCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const headers = (0, HeaderAccurateUtil_1.generateHeader)();
            const response = yield axios_1.default.get(process.env.ACCURATE_HOST + '/accurate/api/item-category/list.do', {
                headers,
                params: {
                    'fields': 'id,name'
                }
            });
            return {
                status: 'success',
                data: response.data.data.d
            };
        }
        catch (error) {
            return {
                status: 'error',
                data: error
            };
        }
        return {};
    });
}
exports.callCategory = callCategory;
function updateIdAccurate(id, id_accurate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.put(process.env.FRAPPE_HOST + '/api/resource/Item/' + id, {
                'id_accurate': id_accurate,
                'id_sync': 1
            }, {
                headers: {
                    'Authorization': 'token 736960728528a1c:4d043b927a0449d'
                }
            });
            return {
                status: 'success',
                data: response.data
            };
        }
        catch (error) {
            return {
                status: 'error',
                data: error
            };
        }
    });
}
exports.updateIdAccurate = updateIdAccurate;

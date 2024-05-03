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
exports.test = exports.syncAccurate = void 0;
const workflow_1 = require("@temporalio/workflow");
const { callProducts, syncProducts, updateIdAccurate } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '30s',
    scheduleToCloseTimeout: '30s',
});
/** A workflow that simply calls an activity */
function syncAccurate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultProducts = yield callProducts();
            let products = Object(resultProducts);
            if (products.status != 'success') {
                return {
                    'status': 'error',
                    'data': {}
                };
            }
            let data = {
                sync_accurate_error: [],
                sync_accurate_success: [],
                sync_frappe_error: [],
                sync_frappe_success: [],
            };
            for (let index = 0; index < products.data.length; index++) {
                const syncProduct = yield syncProducts(products.data[index].item_name);
                const resultProduct = Object(syncProduct);
                let product = {
                    id: products.data[index].name,
                    name: products.data[index].item_name,
                };
                if (resultProduct.status != 'success') {
                    data.sync_accurate_error.push(product);
                    yield updateIdAccurate(product.id, 0);
                    continue;
                }
                else {
                    data.sync_accurate_success.push(product);
                }
                const updateProduct = yield updateIdAccurate(product.id, resultProduct.data.r.id);
                const resultUpdateProduct = Object(updateProduct);
                if (resultUpdateProduct.status != 'success') {
                    product.id_accurate = resultProduct.data.r.id;
                    data.sync_frappe_error.push(product);
                }
                else {
                    data.sync_frappe_success.push(product);
                }
            }
            return {
                'status': 'success',
                'data': data
            };
        }
        catch (error) {
            return {
                'status': 'error',
                'data': error
            };
        }
    });
}
exports.syncAccurate = syncAccurate;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        return "re";
    });
}
exports.test = test;

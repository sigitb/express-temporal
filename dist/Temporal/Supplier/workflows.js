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
exports.syncAccurateSupplier = void 0;
const workflow_1 = require("@temporalio/workflow");
const date_fns_1 = require("date-fns");
const { callSupplier, syncSupplier, updateIdSupplier } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '30s',
    scheduleToCloseTimeout: '30s',
});
/** A workflow that simply calls an activity */
function syncAccurateSupplier() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultSuppliers = yield callSupplier();
            let suppliers = Object(resultSuppliers);
            if (suppliers.status != 'success') {
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
            for (let index = 0; index < suppliers.data.length; index++) {
                const syncSuppliers = yield syncSupplier(suppliers.data[index].name, (0, date_fns_1.format)(new Date(suppliers.data[index].creation), 'dd/MM/yyyy'));
                const resultSuppliers = Object(syncSuppliers);
                let supplier = {
                    id: suppliers.data[index].name,
                    name: suppliers.data[index].supplier_name,
                };
                if (resultSuppliers.status != 'success') {
                    data.sync_accurate_error.push(supplier);
                    yield updateIdSupplier(0, supplier.id);
                    continue;
                }
                else {
                    data.sync_accurate_success.push(supplier);
                }
                const updateSupplier = yield updateIdSupplier(resultSuppliers.data.r.id, supplier.id);
                const resultUpdateSupplier = Object(updateSupplier);
                if (resultUpdateSupplier.status != 'success') {
                    supplier.id_accurate = resultSuppliers.data.r.id;
                    data.sync_frappe_error.push(supplier);
                }
                else {
                    data.sync_frappe_success.push(supplier);
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
exports.syncAccurateSupplier = syncAccurateSupplier;

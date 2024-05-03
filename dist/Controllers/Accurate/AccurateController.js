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
const LogSyncService_1 = __importDefault(require("../../Services/LogSyncService"));
const StringUtil_1 = __importDefault(require("../../Utils/StringUtil"));
const Temporal_1 = __importDefault(require("../../Temporal/Connections/Temporal"));
const workflows_1 = require("../../Temporal/Product/workflows");
const EnumUtil_1 = require("../../Utils/EnumUtil");
const workflows_2 = require("../../Temporal/Supplier/workflows");
const workflows_3 = require("../../Temporal/PurchasingOrder/workflows");
const axios_1 = __importDefault(require("axios"));
const HeaderAccurateUtil_1 = require("../../Utils/HeaderAccurateUtil");
class AccurateController {
    constructor() {
        this.purchasingOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const objectResponse = {
            //     'data': 'siap mantap',
            //     'message': 'ok',
            //     'status':200
            // }
            // const objectRequest = {
            //     "name": "testing",
            //     "id": 1
            // }
            // const service: LogSyncService = new LogSyncService()
            // service.log('Success', Stringutil.jsonEncode(objectRequest), Stringutil.jsonEncode(objectResponse));
            // return res.send({
            //     data: objectResponse,
            //     message: "purchasing order",
            //     status:200
            // });
            const client = yield Temporal_1.default.client();
            const handle = yield client.workflow.start(workflows_3.getDataFailed, {
                taskQueue: 'accurate-sync-purchasing-order',
                args: [],
                workflowId: 'workflow-sync-temporal-purchasing-order-' + StringUtil_1.default.generateRandomString(7),
                workflowTaskTimeout: '1m',
                workflowRunTimeout: '1m',
            });
            let dataResult = yield handle.result();
            return res.send({
                message: "Sync",
                status: 200,
                data: dataResult
            });
        });
        this.product = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const service = new LogSyncService_1.default();
            const client = yield Temporal_1.default.client();
            const handle = yield client.workflow.start(workflows_1.syncAccurate, {
                taskQueue: 'sync-accurate-product',
                args: [],
                workflowId: 'workflow-sync-temporal-product-' + StringUtil_1.default.generateRandomString(7),
                workflowTaskTimeout: '1m',
                workflowRunTimeout: '1m',
            });
            let dataResult = yield handle.result();
            let result = {
                status: Object(dataResult).status,
                data: Object(dataResult).data
            };
            service.log('result-workflow', req.body.toString(), StringUtil_1.default.jsonEncode(result));
            if (result.status != 'success') {
                service.log('error-workflow', req.body.toString(), StringUtil_1.default.jsonEncode(result));
                return res.send({
                    message: "Sync-failed",
                    status: 200,
                    data: {}
                });
            }
            for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
                let dataAccurateFailed = result.data.sync_accurate_error[index];
                console.log(dataAccurateFailed);
                service.logAccurateSync(EnumUtil_1.SyncType.PRODUCT, dataAccurateFailed.name, StringUtil_1.default.jsonEncode(dataAccurateFailed));
            }
            for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
                let dataFrappeFailed = result.data.sync_frappe_error[index];
                console.log(dataFrappeFailed);
                service.logFrappeSync(EnumUtil_1.SyncType.PRODUCT, String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, StringUtil_1.default.jsonEncode(dataFrappeFailed));
            }
            let responseData = {
                data_accurate_error: result.data.sync_accurate_error,
                data_accurate_success: result.data.sync_accurate_success,
                data_frappe_error: result.data.sync_frappe_error,
                data_frappe_success: result.data.sync_frappe_success
            };
            return res.send({
                message: "Sync",
                status: 200,
                data: responseData
            });
        });
        this.supplier = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const service = new LogSyncService_1.default();
            const client = yield Temporal_1.default.client();
            const handle = yield client.workflow.start(workflows_2.syncAccurateSupplier, {
                taskQueue: 'sync-accurate-supplier',
                args: [],
                workflowId: 'workflow-sync-temporal-supplier-' + StringUtil_1.default.generateRandomString(7),
                workflowTaskTimeout: '1m',
                workflowRunTimeout: '1m',
            });
            let dataResult = yield handle.result();
            let result = {
                status: Object(dataResult).status,
                data: Object(dataResult).data
            };
            service.log('result-workflow', req.body.toString(), StringUtil_1.default.jsonEncode(result));
            if (result.status != 'success') {
                service.log('error-workflow', req.body.toString(), StringUtil_1.default.jsonEncode(result));
                return res.send({
                    message: "Sync-failed",
                    status: 200,
                    data: {}
                });
            }
            for (let index = 0; index < result.data.sync_accurate_error.length; index++) {
                let dataAccurateFailed = result.data.sync_accurate_error[index];
                console.log(dataAccurateFailed);
                service.logAccurateSync(EnumUtil_1.SyncType.SUPPLIER, dataAccurateFailed.name, StringUtil_1.default.jsonEncode(dataAccurateFailed));
            }
            for (let index = 0; index < result.data.sync_frappe_error.length; index++) {
                let dataFrappeFailed = result.data.sync_frappe_error[index];
                console.log(dataFrappeFailed);
                service.logFrappeSync(EnumUtil_1.SyncType.SUPPLIER, String(dataFrappeFailed.id_accurate), dataFrappeFailed.id, StringUtil_1.default.jsonEncode(dataFrappeFailed));
            }
            let responseData = {
                data_accurate_error: result.data.sync_accurate_error,
                data_accurate_success: result.data.sync_accurate_success,
                data_frappe_error: result.data.sync_frappe_error,
                data_frappe_success: result.data.sync_frappe_success
            };
            return res.send({
                message: "Sync",
                status: 200,
                data: responseData
            });
        });
        this.getDatabaseAccurate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const headers = (0, HeaderAccurateUtil_1.generateHeader)();
            const response = yield axios_1.default.post('https://account.accurate.id/api/api-token.do', {}, { headers });
            return res.send({
                message: "database",
                status: 200,
                data: response.data
            });
        });
    }
}
exports.default = new AccurateController();

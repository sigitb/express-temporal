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
exports.getDataFailed = void 0;
const workflow_1 = require("@temporalio/workflow");
const { greet } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '30s',
    scheduleToCloseTimeout: '30s',
});
/** A workflow that simply calls an activity */
function getDataFailed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultFailed = yield greet();
            let Failed = Object(resultFailed);
            return {
                'status': 'success',
                'data': Failed
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
exports.getDataFailed = getDataFailed;

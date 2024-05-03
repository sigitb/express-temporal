"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoutes_1 = __importDefault(require("./BaseRoutes"));
// controller
const AccurateController_1 = __importDefault(require("../Controllers/Accurate/AccurateController"));
// import {validateRegister, validateLogin} from "../Middlewares/AuthValidator";
// import { auth } from "../Middlewares/AuthMiddlewate";
class AccurateRoute extends BaseRoutes_1.default {
    routes() {
        this.router.get("/sync-product", AccurateController_1.default.product);
        this.router.get("/sync-supplier", AccurateController_1.default.supplier);
        this.router.get("/purchasing-order", AccurateController_1.default.purchasingOrder);
        this.router.get("/database-accurate", AccurateController_1.default.getDatabaseAccurate);
    }
}
exports.default = new AccurateRoute().router;

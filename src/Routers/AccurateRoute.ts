import BaseRoutes from "./BaseRoutes";
import {Request, Response} from "express";

// controller
import AccurateController from '../Controllers/Accurate/AccurateController';
// import {validateRegister, validateLogin} from "../Middlewares/AuthValidator";
import { auth } from "../Middlewares/Authentication";

class AccurateRoute extends BaseRoutes{

    public routes(): void {
        this.router.get("/sync-product", auth, AccurateController.product);
        this.router.get("/sync-supplier", auth, AccurateController.supplier);
        this.router.get("/purchasing-order", auth, AccurateController.purchasingOrder);
        this.router.get("/database-accurate", auth, AccurateController.getDatabaseAccurate);
    }
}

export default new AccurateRoute().router;
import express, {Application, Request, Response} from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from 'cors'
import { config as dotenv } from 'dotenv';
import cron from 'node-cron';

// routes
import AccurateRoutes from "./Routers/AccurateRoute";
import { FailedAccurateJobProduct, FailedFrappeJobProduct } from "./Jobs/FailedSyncProductJob";
import { FailedAccurateJobSupplier, FailedFrappeJobSupplier } from "./Jobs/FailedSyncSupplierJob";
import { FailedFrappeJobPurchaseOrder } from "./Jobs/FailedSyncPurchaseOrderJob";

class App {
    public app: Application;
    
    constructor() {
        this.app = express();
        this.plugins();
        this.routes();
        this.jobs();
        dotenv();
    }

    protected plugins(): void{
        this.app.use(bodyParser.json());
        this.app.use(morgan("dev"));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());
    }

    protected routes(): void{
        this.app.route("/").get((req: Request, res: Response) => {
            res.send("routing to typescript");
        });
        this.app.use("/api/temporal/accurate", AccurateRoutes)
    }

    protected jobs(): void{
        cron.schedule('* * * * *', FailedFrappeJobProduct);
        cron.schedule('* * * * *', FailedAccurateJobProduct);
        cron.schedule('* * * * *', FailedAccurateJobSupplier);
        cron.schedule('* * * * *', FailedFrappeJobSupplier);
        cron.schedule('* * * * *', FailedFrappeJobPurchaseOrder);
    }
}

const port: number = 9090;
const app = new App().app;
app.listen(port, () => {
    console.log("aplikasi ini berjalan dengan port " + port);

});


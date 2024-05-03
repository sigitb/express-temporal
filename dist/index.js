"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const node_cron_1 = __importDefault(require("node-cron"));
// routes
const AccurateRoute_1 = __importDefault(require("./Routers/AccurateRoute"));
const FailedFrappeJob_1 = require("./Jobs/FailedFrappeJob");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.plugins();
        this.routes();
        this.jobs();
        (0, dotenv_1.config)();
    }
    plugins() {
        this.app.use(body_parser_1.default.json());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, compression_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.route("/").get((req, res) => {
            res.send("routing to typescript");
        });
        this.app.use("/api/temporal/accurate", AccurateRoute_1.default);
    }
    jobs() {
        node_cron_1.default.schedule('* * * * *', FailedFrappeJob_1.FailedFrappeJob);
    }
}
const port = 8080;
const app = new App().app;
app.listen(port, () => {
    console.log("aplikasi ini berjalan dengan port " + port);
});

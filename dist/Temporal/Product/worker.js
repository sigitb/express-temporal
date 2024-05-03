"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const worker_1 = require("@temporalio/worker");
const activities = __importStar(require("./activities"));
require("dotenv").config();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // Step 1: Establish a connection with Temporal server.
        //
        // Worker code uses `@temporalio/worker.NativeConnection`.
        // (But in your application code it's `@temporalio/client.Connection`.)
        const connection = yield worker_1.NativeConnection.connect({
            address: process.env.URL_TEMPORAL,
            // TLS and gRPC metadata configuration goes here.
        });
        // Step 2: Register Workflows and Activities with the Worker.
        const worker = yield worker_1.Worker.create({
            connection,
            namespace: 'default',
            taskQueue: 'sync-accurate-product',
            // Workflows are registered using a path as they run in a separate JS context.
            workflowsPath: require.resolve('./workflows'),
            activities,
        });
        // Step 3: Start accepting tasks on the `hello-world` queue
        //
        // The worker runs until it encounters an unexpected error or the process receives a shutdown signal registered on
        // the SDK Runtime object.
        //
        // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
        //
        // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
        yield worker.run();
    });
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});

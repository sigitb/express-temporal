"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const concurrently_1 = __importDefault(require("concurrently"));
const commands = [
    'nodemon src/Temporal/Product/worker.ts',
    'nodemon src/Temporal/Supplier/worker.ts'
];
(0, concurrently_1.default)(commands);

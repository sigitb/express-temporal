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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeader = void 0;
const crypto = __importStar(require("crypto"));
function generateHeader() {
    const key = process.env.ACCURATE_KEY || 'GXvV5sHWBkXZwYOnBmmcr6QhnVVeQy2Whu9Aa0ubZ66A0ONRPjzGYbKZbfR5hRuc';
    const timestamp = new Date().toISOString();
    const hmac = generateHmac(key, timestamp);
    const headers = {
        'Authorization': 'Bearer ' + process.env.ACCURATE_TOKEN,
        'X-Api-Timestamp': timestamp,
        'X-Api-Signature': hmac,
        'X-Session-ID': process.env.ACCURATE_DB || '1219052',
    };
    return headers;
}
exports.generateHeader = generateHeader;
function generateHmac(key, timestamp) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(timestamp);
    return hmac.digest('base64');
}

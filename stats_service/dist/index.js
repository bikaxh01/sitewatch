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
const dotenv_1 = require("dotenv");
const checks_1 = require("./config/checks");
const db_1 = require("./config/db");
const ws_1 = __importDefault(require("ws"));
const https_1 = __importDefault(require("https"));
const logger_1 = require("./config/logger");
const agent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
(0, dotenv_1.config)();
function wsConnection() {
    const ws = new ws_1.default(process.env.WS_SERVER, { agent });
    ws.on("open", () => {
        logger_1.logger.info("WebSocket connected");
        const pingInterval = setInterval(() => {
            console.log("Sending ping to all connected clients...");
            ws.send("ping");
        }, 30000);
    });
    ws.on("message", (data) => {
        console.log("🚀 ~ ws.on ~ data:", data.toString());
        const msg = data.toString();
        if (msg == "pong") {
            console.log("🚀 ~ ws.on ~ pong:", msg);
        }
        try {
            const parsed = JSON.parse(data.toString());
            main(parsed);
        }
        catch (err) {
            logger_1.logger.error("Invalid data received");
        }
    });
    ws.on("close", (code) => {
        logger_1.logger.warn(`WebSocket closed . reconnecting...`);
        reconnect();
    });
    ws.on("error", (err) => {
        logger_1.logger.error("WebSocket error:", err);
        ws.close();
    });
}
function reconnect(delay = 2000) {
    setTimeout(() => {
        logger_1.logger.info("Attempting to reconnect...");
        wsConnection();
    }, delay);
}
wsConnection();
const currentRegion = process.env.Region;
function main(data) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info("🚀 ~ Received Data:", data);
        if (!data) {
            console.log("No data received.");
            return;
        }
        const urlId = data.urlId;
        const url = data.url;
        const statsResult = yield (0, checks_1.getStats)(url);
        if (!currentRegion) {
            console.log("Invalid region 🔴");
            process.exit(0);
            return;
        }
        const finalData = {
            dataTransfer: statsResult.start_transfer,
            nameLookup: statsResult.name_lookup,
            region: currentRegion,
            tcpConnection: statsResult.tcp_connection,
            tlsHandshake: statsResult.tls_handshake,
            totalTime: statsResult.total_time,
            url: url,
            urlId: urlId,
        };
        yield (0, db_1.addToDb)(finalData);
    });
}

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
const ws = new ws_1.default("ws://localhost:8000");
ws.on("message", (data) => {
    console.log("ws connected");
    const obj = data.toString();
    const parsedData = JSON.parse(obj);
    console.log("🚀 ~ ws.on ~ parsedData:", parsedData);
    main(parsedData);
});
(0, dotenv_1.config)();
const currentRegion = process.env.Region;
// subscribe topic
// get data
// parse data
function main(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 ~ main ~ data:", data);
        if (!data) {
            console.log("No data received.");
            return;
        }
        const urlId = data.data;
        console.log("🚀 ~ main ~ urlId:", urlId);
        const url = data.url;
        console.log("🚀 ~ main ~ url:", url);
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

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
exports.addToDb = addToDb;
const influxdb3_client_1 = require("@influxdata/influxdb3-client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const token = process.env.INFLUXDB_TOKEN;
const host = process.env.INFLUXDB_HOST;
const bucket = process.env.INFLUX_BUCKET;
function addToDb(_a) {
    return __awaiter(this, arguments, void 0, function* ({ urlId, url, tcpConnection, dataTransfer, nameLookup, tlsHandshake, totalTime, region, }) {
        try {
            const client = new influxdb3_client_1.InfluxDBClient({ host: host, token: token });
            const data = influxdb3_client_1.Point.measurement("monitoring_stats")
                .setTag("urlId", urlId)
                .setTag("url", url)
                .setTag("region", region)
                .setFloatField("tcp_connection", tcpConnection)
                .setFloatField("name_lookup", nameLookup)
                .setFloatField("tls_handshake", tlsHandshake)
                .setFloatField("data_transfer", dataTransfer)
                .setFloatField("total_time", totalTime);
            const res = yield client.write(data, bucket);
            client.close();
        }
        catch (error) {
            console.log("🚀 ~ error:", error);
        }
    });
}

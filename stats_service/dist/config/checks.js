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
exports.getStats = getStats;
const child_process_1 = require("child_process");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function getStats(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.ENV === "PROD") {
            console.log(`checking ping for ${url} in PROD`);
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)(`curl -s -w '{"name_lookup": "%{time_namelookup}", "tcp_connection": "%{time_connect}", "tls_handshake": "%{time_appconnect}", "start_transfer": "%{time_starttransfer}", "total_time": "%{time_total}"}' -o /dev/null ${url} | jq .`, (error, stdOut, stdErr) => {
                    if (error) {
                        console.log("🚀 ~ exec ~ error:", error);
                        const response = {
                            name_lookup: 0.0,
                            start_transfer: 0.0,
                            tcp_connection: 0.0,
                            tls_handshake: 0.0,
                            total_time: 0.0,
                        };
                        resolve(response);
                    }
                    else if (stdErr) {
                        console.log("🚀 ~ exec ~ stdErr:", stdErr);
                        const response = {
                            name_lookup: 0.0,
                            start_transfer: 0.0,
                            tcp_connection: 0.0,
                            tls_handshake: 0.0,
                            total_time: 0.0,
                        };
                        resolve(response);
                    }
                    else {
                        const parsedResponse = JSON.parse(stdOut);
                        console.log("🚀 ~ returnnewPromise ~ parsedResponse:", parsedResponse);
                        // parse response extract stats conver to milisecond
                        const finalResponse = {
                            name_lookup: secondToMillisecond(parsedResponse.name_lookup),
                            start_transfer: secondToMillisecond(parsedResponse.start_transfer),
                            tcp_connection: secondToMillisecond(parsedResponse.tcp_connection),
                            tls_handshake: secondToMillisecond(parsedResponse.tls_handshake),
                            total_time: secondToMillisecond(parsedResponse.total_time),
                        };
                        resolve(finalResponse);
                    }
                });
            });
        }
        else {
            // while running in local
            console.log(`checking ping for ${url} in Dev`);
            return {
                name_lookup: 0.148957,
                tcp_connection: 0.150128,
                tls_handshake: 0.0,
                start_transfer: 0.152197,
                total_time: 0.152233,
            };
        }
    });
}
function secondToMillisecond(second) {
    return Number(second) * 1000;
}

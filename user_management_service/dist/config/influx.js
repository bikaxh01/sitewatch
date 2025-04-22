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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastChecked = lastChecked;
exports.getUrlStat = getUrlStat;
const influxdb3_client_1 = require("@influxdata/influxdb3-client");
const db_1 = require("./db");
const token = process.env.INFLUXDB_TOKEN;
const host = process.env.INFLUXDB_HOST;
const bucket = process.env.INFLUX_BUCKET;
let database = bucket;
const client = new influxdb3_client_1.InfluxDBClient({
    host: host,
    token: token,
    database: database,
});
function lastChecked(urlId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const query = `
  SELECT * FROM "monitoring_stats"
  WHERE "urlId" = '${urlId}' AND time >= now() - interval '24 hours'
  ORDER BY time DESC
  LIMIT 1
`;
        const data = yield client.query(query, bucket);
        try {
            for (var _d = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _a = data_1_1.done, !_a; _d = true) {
                _c = data_1_1.value;
                _d = false;
                const row = _c;
                return row; // Access each row in the result.
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = data_1.return)) yield _b.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function getUrlStat(urlId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        const query = `
  SELECT * FROM "monitoring_stats"
  WHERE "urlId" = '${urlId}' AND time >= now() - interval '24 hours'
`;
        const data = yield client.query(query, bucket);
        const statsData = [];
        try {
            for (var _d = true, data_2 = __asyncValues(data), data_2_1; data_2_1 = yield data_2.next(), _a = data_2_1.done, !_a; _d = true) {
                _c = data_2_1.value;
                _d = false;
                const row = _c;
                const formattedRow = {
                    time: (0, db_1.formatTime)(row.time),
                    max: row.ping_max,
                    avg: row.ping_avg,
                };
                statsData.push(formattedRow);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = data_2.return)) yield _b.call(data_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return statsData;
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const dotenv_1 = require("dotenv");
const redis_1 = require("redis");
(0, dotenv_1.config)();
const redisClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
exports.redisClient = redisClient;
redisClient.on("error", (error) => {
    console.log("🚀 ~ redisClient.on ~ error:", error);
    console.log("ERROR WHILE CONNECTING REDIS 🔴🔴");
});

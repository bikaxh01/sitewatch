"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    // Get time in 24-hour format
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const time24hr = `${hours}:${minutes}`;
    return time24hr;
};
exports.formatTime = formatTime;

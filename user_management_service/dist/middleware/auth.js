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
exports.validateUser = validateUser;
exports.limiter = limiter;
const response_1 = require("../utils/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const db_1 = require("../config/db");
const express_rate_limit_1 = require("express-rate-limit");
(0, dotenv_1.config)();
function validateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.authToken;
            const jwtSecret = process.env.JWT_SECRET;
            if (!token) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.UNAUTHORIZED, "no token");
            }
            // decode token
            const { email, id } = jsonwebtoken_1.default.verify(token, jwtSecret);
            if (!email || !id) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.UNAUTHORIZED, "Unauthorized");
            }
            // validate user
            const verifyUser = yield db_1.prisma.user.findUnique({
                where: {
                    id,
                    email,
                },
            });
            if (!verifyUser) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.UNAUTHORIZED, "user doesn't exists");
            }
            req.body.userId = verifyUser.id;
            // next
            next();
        }
        catch (error) {
            res.clearCookie("authToken");
            console.log("🚀 ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.UNAUTHORIZED, "Unauthorized user");
        }
    });
}
const limiterInstance = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
function limiter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 ~ limiter ~ req:", req.ip);
        try {
            limiterInstance(req, res, next);
        }
        catch (error) {
            console.log("🚀 ~ limiter ~ error:", error);
            res.status(429).json({ message: "Too many requests" });
        }
    });
}

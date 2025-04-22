"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMonitorSchema = exports.emailSignInSchema = exports.signUpSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(3, { message: "First Name must contain at least 3 character" }),
    lastName: zod_1.z
        .string()
        .optional(),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must contain at least 8 character" }),
    signUpType: zod_1.z.nativeEnum(client_1.SignUpMethod),
});
exports.emailSignInSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must contain at least 8 character" }),
});
exports.registerMonitorSchema = zod_1.z.object({
    url: zod_1.z.string(),
    checkInterval: zod_1.z.string(),
    monitorName: zod_1.z.string().optional(),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const response_1 = require("../utils/response");
const reqValidator_1 = require("../middleware/reqValidator");
const zod_1 = require("../types/zod");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const userRoute = express_1.default.Router();
exports.userRoute = userRoute;
userRoute.get("/", (req, res) => {
    return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "All Good ✅✅", []);
});
userRoute.post("/email-sign-up", (0, reqValidator_1.reqValidator)(zod_1.signUpSchema), user_controller_1.emailSignup);
userRoute.post("/email-sign-in", (0, reqValidator_1.reqValidator)(zod_1.emailSignInSchema), user_controller_1.emailSignIn);
userRoute.get("/internal/get-user", user_controller_1.getUserByMonitor);
userRoute.get("/validate-email", user_controller_1.validateEmail);
userRoute.get("/get-user", auth_1.validateUser, user_controller_1.getAllUser);
userRoute.get("/logout-user", user_controller_1.logoutUser);
userRoute.post("/forget-password", user_controller_1.forgetPassword);
userRoute.post("/verify-opt", auth_1.limiter, user_controller_1.verifyOpt);
userRoute.post("/change-password", user_controller_1.changePassword);
userRoute.get("/verify-email", user_controller_1.signupVerifyEmail);

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
exports.emailSignup = emailSignup;
exports.emailSignIn = emailSignIn;
exports.getUserByMonitor = getUserByMonitor;
exports.validateEmail = validateEmail;
exports.getAllUser = getAllUser;
exports.logoutUser = logoutUser;
exports.forgetPassword = forgetPassword;
exports.verifyOpt = verifyOpt;
exports.changePassword = changePassword;
exports.signupVerifyEmail = signupVerifyEmail;
exports.changeEmail = changeEmail;
exports.changeEmailOptVerify = changeEmailOptVerify;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const response_1 = require("../utils/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const resend_1 = require("resend");
(0, dotenv_1.config)();
const passwordSalt = bcryptjs_1.default.genSaltSync(10);
function emailSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, firstName, signUpType, lastName } = req.body;
        console.log(req.body);
        try {
            // check user email
            const userExists = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (userExists) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.ALREADY_EXISTS, "Email already in used", []);
            }
            // hash password
            const hashedPassword = bcryptjs_1.default.hashSync(password, passwordSalt);
            const user = yield db_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    signUpType: signUpType,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                },
            });
            // create jwt email,userid
            const jwtSecret = process.env.JWT_SECRET;
            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = jsonwebtoken_1.default.sign(payload, jwtSecret);
            // generate link : baseurl+?token=jwt
            const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
            yield resend.emails.send({
                from: "Forget-password<Alert@sitewatch.tech>",
                to: [email],
                subject: "Verify you email",
                html: `<p>you verification link is ${process.env.BASE_URL}/api/user/signupVerifyEmail?token=${token}  </p>`,
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.CREATED, "User created", user);
        }
        catch (error) {
            console.log("🚀 ~ emailSignup ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong", [], "error occurred while creating user");
        }
    });
}
function emailSignIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = yield req.body;
        const jwtSecret = process.env.JWT_SECRET;
        try {
            // check user exists
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "Email not registered", []);
            }
            // if (user.isVerified !== true) {
            //   return sendResponse(
            //     res,
            //     STATUS.NOT_FOUND,
            //     "Email is not verified Pls verified it "
            //   );
            // }
            // compare password
            const verifyPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!verifyPassword) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.UNAUTHORIZED, "Incorrect password");
            }
            // create jwt
            const payload = {
                id: user.id,
                email: user.email,
                createAt: user.createdAt,
            };
            const token = jsonwebtoken_1.default.sign(payload, jwtSecret);
            res.cookie("authToken", token);
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully signed In");
        }
        catch (error) {
            console.log("🚀 ~ emailSignIn ~ error:", error);
            (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
function getUserByMonitor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { urlId } = req.query;
            if (!urlId) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Invalid query");
            }
            const isExists = yield db_1.prisma.monitor.findUnique({
                where: {
                    id: urlId,
                },
                include: {
                    user: true,
                },
            });
            if (!isExists) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "Invalid url id");
            }
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "user fetch successfully", isExists);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
//debounce
function validateEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.query;
            if (!email) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid email");
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isValidFormat = emailRegex.test(email);
            if (!isValidFormat) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid email format");
            }
            const alreadyExists = yield db_1.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (alreadyExists) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Email already registered");
            }
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "seems unique 😎");
        }
        catch (error) {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
function getAllUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.body.userId;
            if (!userId) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "User ID not found in cookies");
            }
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatarUrl: true,
                    signUpType: true,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully", user);
        }
        catch (error) {
            console.log("🚀 ~ getAllUser ~ error:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    });
}
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).cookie("authToken", "", { maxAge: 0 }).json({
                message: "Logout successfully",
                success: true,
            });
        }
        catch (error) {
            console.log("🚀 ~ LogoutUser ~ error:", error);
            res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
    });
}
function forgetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = yield req.body;
            const user = yield db_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "User Not found");
            }
            const existingOpt = yield db_1.prisma.forgetPassword.findUnique({
                where: {
                    userId: user.id,
                },
            });
            if (existingOpt) {
                yield db_1.prisma.forgetPassword.delete({
                    where: {
                        userId: user.id,
                    },
                });
            }
            const code = Math.floor(1000 + Math.random() * 9000);
            yield db_1.prisma.forgetPassword.create({
                data: {
                    otp: code,
                    userId: user.id,
                },
            });
            const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
            yield resend.emails.send({
                from: "Forget-password<Alert@sitewatch.tech>",
                to: [email],
                subject: "Reset your password",
                html: `<p>you opt is ${code}  to reset your password.</p>`,
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Otp Send Successfully");
        }
        catch (error) {
            console.log("🚀 ~ updateUser ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "Something went wrong");
        }
    });
}
function verifyOpt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp, email } = yield req.body;
            if (!otp || !email) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Enter all Field");
            }
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            const getDbOtp = yield db_1.prisma.forgetPassword.findUnique({
                where: {
                    userId: user.id,
                },
            });
            if (!getDbOtp) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "invalid request");
            }
            const matchOtp = (yield getDbOtp.otp) == otp;
            if (!matchOtp) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Opt does not match");
            }
            const setVerified = yield db_1.prisma.forgetPassword.update({
                where: {
                    id: getDbOtp.id,
                },
                data: {
                    isVerified: true,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Opt match Successfully");
        }
        catch (error) {
            console.log("🚀 ~ verifyOpt ~ error:", error);
        }
    });
}
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, email } = req.body;
            if (!password || !email) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Enter all Field");
            }
            const user = yield db_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Enter all Field");
            }
            const hashedPassword = bcryptjs_1.default.hashSync(password, passwordSalt);
            const updatePassword = yield db_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Password Successfully Changed");
        }
        catch (error) {
            console.log("🚀 ~ changePassword ~ error:", error);
        }
    });
}
function signupVerifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.query.token;
            if (!token) {
                (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "please click valid email");
            }
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const email = decode.email;
            const user = yield db_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Please click valid email");
            }
            yield db_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                },
            });
        }
        catch (error) {
            console.log("🚀 ~ const-verifyEmail ~ error:", error);
        }
    });
}
function changeEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.ALREADY_EXISTS, "otp has been send to your email", []);
            }
            const code = Math.floor(1000 + Math.random() * 9000);
            yield db_1.prisma.changeEmail.create({
                data: {
                    otp: code,
                    userId: user.id,
                },
            });
            const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
            yield resend.emails.send({
                from: "Forget-password<Alert@sitewatch.tech>",
                to: [email],
                subject: "Reset your password",
                html: `<p>you opt is ${code}  to reset your password.</p>`,
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Otp Send Successfully to change email");
        }
        catch (error) {
            console.log("🚀 ~ updateUser ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "Something went wrong");
        }
    });
}
function changeEmailOptVerify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { verifyOpt, email } = yield req.body;
            if (!verifyOpt) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Enter all Field");
            }
            const otp = yield db_1.prisma.changeEmail.findUnique({
                where: {
                    userId: req.body.userId
                },
            });
            // const getDbOtp = await prisma.changeEmail.findUnique({
            //   where: {
            //     userId: user.id,
            //   },
            // });
            // if (!getDbOtp) {
            //   return sendResponse(res, STATUS.INTERNAL_ERROR, "invalid request");
            // }
            const matchOtp = (yield otp.otp) == verifyOpt;
            if (!matchOtp) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Opt does not match");
            }
            yield db_1.prisma.forgetPassword.update({
                where: {
                    id: otp.id,
                },
                data: {
                    isVerified: true,
                },
            });
            yield db_1.prisma.user.update({
                where: {
                    id: otp.id,
                },
                data: {
                    email: email,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Opt match Successfully");
        }
        catch (error) {
            console.log("🚀 ~ changeEmailOptVerify ~ error:", error);
        }
    });
}

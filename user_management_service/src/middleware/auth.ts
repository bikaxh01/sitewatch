import { NextFunction, Request, Response } from "express";
import { sendResponse, STATUS } from "../utils/response";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { prisma } from "../config/db";
import { rateLimit } from "express-rate-limit";

config();

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.authToken;

    const jwtSecret = process.env.JWT_SECRET;

    if (!token) {
      return sendResponse(res, STATUS.UNAUTHORIZED, "no token");
    }

    // decode token
    const { email, id }: any = jwt.verify(token, jwtSecret);

    if (!email || !id) {
      return sendResponse(res, STATUS.UNAUTHORIZED, "Unauthorized");
    }
    // validate user
    const verifyUser = await prisma.user.findUnique({
      where: {
        id,
        email,
      },
    });

    if (!verifyUser) {
      return sendResponse(res, STATUS.UNAUTHORIZED, "user doesn't exists");
    }
    req.body.userId = verifyUser.id;

    // next
    next();
  } catch (error) {
    res.clearCookie("authToken");
    console.log("🚀 ~ error:", error);
    return sendResponse(res, STATUS.UNAUTHORIZED, "Unauthorized user");
  }
}

const limiterInstance = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export async function limiter(req: Request, res: Response, next: NextFunction) {
  console.log("🚀 ~ limiter ~ req:", req.ip);
  try {
    limiterInstance(req, res, next);
  } catch (error) {
    console.log("🚀 ~ limiter ~ error:", error);
    res.status(429).json({ message: "Too many requests" });
  }
}

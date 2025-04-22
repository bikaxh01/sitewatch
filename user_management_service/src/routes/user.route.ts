import express, { Request, Response } from "express";
import { sendResponse, STATUS } from "../utils/response";
import { reqValidator } from "../middleware/reqValidator";
import { signUpSchema, emailSignInSchema } from "../types/zod";
import {
  changePassword,
  emailSignIn,
  emailSignup,
  forgetPassword,
  getAllUser,
  getUserByMonitor,
  logoutUser,
  validateEmail,
  signupVerifyEmail,
  verifyOpt,
} from "../controllers/user.controller";
import { limiter, validateUser } from "../middleware/auth";

const userRoute = express.Router();

userRoute.get("/", (req: Request, res: Response) => {
  return sendResponse(res, STATUS.SUCCESS, "All Good ✅✅", []);
});

userRoute.post("/email-sign-up", reqValidator(signUpSchema), emailSignup);
userRoute.post("/email-sign-in", reqValidator(emailSignInSchema), emailSignIn);
userRoute.get("/internal/get-user", getUserByMonitor);
userRoute.get("/validate-email", validateEmail);
userRoute.get("/get-user", validateUser, getAllUser);
userRoute.get("/logout-user", logoutUser);
userRoute.post("/forget-password", forgetPassword);
userRoute.post("/verify-opt", limiter, verifyOpt);
userRoute.post("/change-password", changePassword);
userRoute.get("/verify-email", signupVerifyEmail);

export { userRoute };



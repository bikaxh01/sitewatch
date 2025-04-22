import { SignUpMethod } from "@prisma/client";
import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First Name must contain at least 3 character" }),
  lastName: z
    .string()
    .optional(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character" }),
  signUpType: z.nativeEnum(SignUpMethod),
});

export const emailSignInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character" }),
});

export const registerMonitorSchema = z.object({
  url: z.string(),
  checkInterval: z.string(),
  monitorName: z.string().optional(),
});

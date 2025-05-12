import { Request, response, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { SignUpMethod } from "@prisma/client";
import { sendResponse, STATUS } from "../utils/response";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Resend } from "resend";
import { logger } from "../config/log";

config();
const passwordSalt = bcrypt.genSaltSync(10);

export async function emailSignup(req: Request, res: Response) {
  const { email, password, firstName, signUpType, lastName } = req.body;
 

  try {
    // check user email
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return sendResponse(
        res,
        STATUS.ALREADY_EXISTS,
        "Email already in used",
        []
      );
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, passwordSalt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        signUpType: signUpType as SignUpMethod,
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

    const token = jwt.sign(payload, jwtSecret);
    // generate link : baseurl+?token=jwt
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Forget-password<Alert@sitewatch.tech>",
    //   to: [email],
    //   subject: "Verify you email",
    //   html: `<p>you verification link is ${process.env.BASE_URL}/api/user/signupVerifyEmail?token=${token}  </p>`,
    // });

    return sendResponse(res, STATUS.CREATED, "User created", user);
  } catch (error) {
    logger.error("🚀 ~ emailSignup ~ error:", error);
    return sendResponse(
      res,
      STATUS.INTERNAL_ERROR,
      "something went wrong",
      [],
      "error occurred while creating user"
    );
  }
}

export async function emailSignIn(req: Request, res: Response) {
  const { email, password } = await req.body;
  const jwtSecret = process.env.JWT_SECRET;
  try {
    // check user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return sendResponse(res, STATUS.NOT_FOUND, "Email not registered", []);
    }

    // if (user.isVerified !== true) {
    //   return sendResponse(
    //     res,
    //     STATUS.NOT_FOUND,
    //     "Email is not verified Pls verified it "
    //   );
    // }

    // compare password
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return sendResponse(res, STATUS.UNAUTHORIZED, "Incorrect password");
    }

    // create jwt
    const payload = {
      id: user.id,
      email: user.email,
      createAt: user.createdAt,
    };
    const token = jwt.sign(payload, jwtSecret);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return sendResponse(res, STATUS.SUCCESS, "successfully signed In");
  } catch (error) {
    logger.error("🚀 ~ emailSignIn ~ error:", error);
    sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

export async function getUserByMonitor(req: Request, res: Response) {
  try {
    const { urlId } = req.query;

    if (!urlId) {
      return sendResponse(res, STATUS.NOT_ALLOWED, "Invalid query");
    }

    const isExists = await prisma.monitor.findUnique({
      where: {
        id: urlId as string,
      },
      include: {
        user: true,
      },
    });

    if (!isExists) {
      return sendResponse(res, STATUS.NOT_FOUND, "Invalid url id");
    }

    return sendResponse(
      res,
      STATUS.SUCCESS,
      "user fetch successfully",
      isExists
    );
  } catch (error) {
    sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

//debounce
export async function validateEmail(req: Request, res: Response) {
  try {
    const { email } = req.query;

    if (!email) {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid email");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValidFormat = emailRegex.test(email as string);

    if (!isValidFormat) {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid email format");
    }

    const alreadyExists = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    if (alreadyExists) {
      return sendResponse(res, STATUS.NOT_ALLOWED, "Email already registered");
    }

    return sendResponse(res, STATUS.SUCCESS, "seems unique 😎");
  } catch (error) {
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

export async function getAllUser(req: Request, res: Response) {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return sendResponse(
        res,
        STATUS.NOT_ALLOWED,
        "User ID not found in cookies"
      );
    }
    const user = await prisma.user.findUnique({
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

    return sendResponse(res, STATUS.SUCCESS, "successfully", user);
  } catch (error) {
    logger.error("🚀 ~ getAllUser ~ error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    res.status(200).cookie("authToken", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    logger.error("🚀 ~ LogoutUser ~ error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = await req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, STATUS.NOT_FOUND, "User Not found");
    }

    const existingOpt = await prisma.forgetPassword.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (existingOpt) {
      await prisma.forgetPassword.delete({
        where: {
          userId: user.id,
        },
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await prisma.forgetPassword.create({
      data: {
        otp: code,
        userId: user.id,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Forget-password<Alert@sitewatch.tech>",
      to: [email],
      subject: "Reset your password",
      html: `<p>you opt is ${code}  to reset your password.</p>`,
    });
    return sendResponse(res, STATUS.SUCCESS, "Otp Send Successfully");
  } catch (error) {
    logger.error("🚀 ~ updateUser ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "Something went wrong");
  }
}

export async function verifyOpt(req: Request, res: Response) {
  try {
    const { otp, email } = await req.body;
    if (!otp || !email) {
      return sendResponse(res, STATUS.INVALID_DATA, "Enter all Field");
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const getDbOtp = await prisma.forgetPassword.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!getDbOtp) {
      return sendResponse(res, STATUS.INTERNAL_ERROR, "invalid request");
    }

    const matchOtp = (await getDbOtp.otp) == otp;

    if (!matchOtp) {
      return sendResponse(res, STATUS.INVALID_DATA, "Opt does not match");
    }

    const setVerified = await prisma.forgetPassword.update({
      where: {
        id: getDbOtp.id,
      },
      data: {
        isVerified: true,
      },
    });
    return sendResponse(res, STATUS.SUCCESS, "Opt match Successfully");
  } catch (error) {
    logger.error("🚀 ~ verifyOpt ~ error:", error);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      return sendResponse(res, STATUS.INVALID_DATA, "Enter all Field");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, STATUS.INVALID_DATA, "Enter all Field");
    }

    const hashedPassword = bcrypt.hashSync(password, passwordSalt);

    const updatePassword = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "Password Successfully Changed");
  } catch (error) {
    logger.error("🚀 ~ changePassword ~ error:", error);
  }
}

export async function signupVerifyEmail(req: Request, res: Response) {
  try {
    const token = req.query.token;

    if (!token) {
      sendResponse(res, STATUS.INVALID_DATA, "please click valid email");
    }

    const decode: any = jwt.verify(token as string, process.env.JWT_SECRET);
    const email = decode.email;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      sendResponse(res, STATUS.INVALID_DATA, "Please click valid email");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
      },
    });
  } catch (error) {
    logger.error("🚀 ~ const-verifyEmail ~ error:", error);
  }
}

export async function changeEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return sendResponse(
        res,
        STATUS.ALREADY_EXISTS,
        "otp has been send to your email",
        []
      );
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await prisma.changeEmail.create({
      data: {
        otp: code,
        userId: user.id,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Forget-password<Alert@sitewatch.tech>",
      to: [email],
      subject: "Reset your password",
      html: `<p>you opt is ${code}  to reset your password.</p>`,
    });

    return sendResponse(
      res,
      STATUS.SUCCESS,
      "Otp Send Successfully to change email"
    );
  } catch (error) {
    logger.error("🚀 ~ updateUser ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "Something went wrong");
  }
}

export async function changeEmailOptVerify(req: Request, res: Response) {
  try {
    const { verifyOpt, email } = await req.body;

    if (!verifyOpt) {
      return sendResponse(res, STATUS.INVALID_DATA, "Enter all Field");
    }

    const otp = await prisma.changeEmail.findUnique({
      where: {
        userId: req.body.userId,
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

    const matchOtp = (await otp.otp) == verifyOpt;

    if (!matchOtp) {
      return sendResponse(res, STATUS.INVALID_DATA, "Opt does not match");
    }

    await prisma.forgetPassword.update({
      where: {
        id: otp.id,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.user.update({
      where: {
        id: otp.id,
      },
      data: {
        email: email,
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "Opt match Successfully");
  } catch (error) {
    logger.error("🚀 ~ changeEmailOptVerify ~ error:", error);
  }
}

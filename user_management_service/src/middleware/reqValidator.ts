import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { sendResponse, STATUS } from "../utils/response";

export function reqValidator(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
  

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));


      return sendResponse(
        res,
        STATUS.INVALID_DATA,
        `${errors[0].field+ " "+ errors[0].message}`,
        [],
        "Invalid request data"
      );
    }

    next();
  };
}



import { Response } from "express";

interface ApiResponse<T> {
  res: Response;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export enum STATUS {
  SUCCESS = 200,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  NOT_ALLOWED = 405,
  CREATED = 201,
  INTERNAL_ERROR = 500,
  INVALID_DATA = 400,
  ALREADY_EXISTS = 409
}

export function sendResponse<T>(
  res: Response,
  status: STATUS,
  message: string,
  data?:T,
  error?: string
) {
  const success = status >= 399 ? false : true;
   res.status(status).json({
    success: success,
    message: message,
    data: success ? data : undefined,
    error: success ? undefined : error,
  } as ApiResponse<T>);
}

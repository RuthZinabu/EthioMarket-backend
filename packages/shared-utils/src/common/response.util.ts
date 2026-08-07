import { AppException } from "./app-exception";
import { Response } from "express";

/**
 * Constant response formatter should be used for all success responses.
 *
 * @param res Express response
 * @param object  {statusCode, message, data}
 */
export const sendSuccessJson = (
  res: Response,
  {
    statusCode = 200,
    message = "Success",
    data,
  }: { statusCode?: number; message?: string; data: unknown },
) => {
  return res.status(statusCode).json({
    status: "success",
    timestamp: new Date().toISOString(),
    // path: res.req.originalUrl,
    message,
    data,
  });
};

export const errorResponse = (res: Response, error: AppException, path: string) => {
  const response = {
    status: "error",
    timestamp: new Date().toISOString(),
    path: path,
    message: error.message,
    code: error.code,
    data: (error as any).data,
  };
  return res.status(error.statusCode).json(response);
};

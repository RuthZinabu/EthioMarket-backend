import { AppException } from "./common";
import { Response, Request } from "express";
import { RedisClient } from "./redis-client";

export const sendSuccessResponse = async (
  req: Request,
  res: Response,
  {
    statusCode = 200,
    message = "Success",
    data,
  }: { statusCode?: number; message?: string; data: unknown },
  addKeyOnResponse = false,
) => {
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      status: "success",
      timestamp: new Date().toISOString(),
      message,
      data,
    });
  }

  if (addKeyOnResponse) {
    const redisClient = await RedisClient.getClient();
  }

  return res.status(statusCode).json({
    status: "success",
    timestamp: new Date().toISOString(),
    message,
    data,
  });
};

export const responsePlain = (
  req: Request,
  res: Response,
  {
    statusCode = 200,
    message = "Success",
    data,
  }: { statusCode?: number; message?: string; data: unknown },
) => {
  console.log("Returning plain response:", { statusCode, message, data }, req.headers);
  return res.status(statusCode).json({
    status: "success",
    timestamp: new Date().toISOString(),
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

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return phoneNumber;

  const normalized = phoneNumber.replace(/\s|-/g, "");

  if (normalized.startsWith("+")) return normalized;

  if (normalized.startsWith("251")) return `+${normalized}`;

  if (normalized.startsWith("0")) {
    return `+251${normalized.slice(1)}`;
  }

  if (/^[79]\d{8}$/.test(normalized)) {
    return `+251${normalized}`;
  }

  return phoneNumber;
};

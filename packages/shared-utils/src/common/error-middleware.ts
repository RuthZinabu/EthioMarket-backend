import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Exceptions, errorDefinitions } from "./errors";
import { AppException } from "./app-exception";
import { logger } from "../utils/logger";
import { errorResponse } from "./response.util";
import { ZodError } from "zod";
import { zodToAppException } from "./zod-error.util";

export const errorHandler = (
  err: Error | AppException | mongoose.Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error: AppException;

  if (err instanceof AppException) {
    error = err;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).reduce(
      (acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    error = new AppException({
      exceptionType: Exceptions.BAD_REQUEST,
      message: "Validation failed",
      data: details,
    });
  } else if (err instanceof mongoose.Error.CastError) {
    // invalid ids on mongo
    error = new AppException({
      exceptionType: Exceptions.BAD_REQUEST,
      message: errorDefinitions.GENERAL.MONGOOSE_INVALID_OBJECT_ID.message,
      code: errorDefinitions.GENERAL.MONGOOSE_INVALID_OBJECT_ID.code,
    });
  } else if ((err as unknown as { code: number }).code === 11000) {
    const mongoError = err as mongoose.mongo.MongoServerError;
    const field = Object.keys(mongoError.keyValue || {})[0] || "field";
    error = new AppException({
      exceptionType: Exceptions.CONFLICT,
      message: errorDefinitions.GENERAL.MONGOOSE_CONFLICT_KEY.message,
      code: errorDefinitions.GENERAL.MONGOOSE_CONFLICT_KEY.code,
      data: { field },
    });
  } else if (err instanceof SyntaxError && "body" in err) {
    error = new AppException({
      exceptionType: Exceptions.BAD_REQUEST,
      message: errorDefinitions.GENERAL.INVALID_JSON_PAYLOAD.message,
      code: errorDefinitions.GENERAL.INVALID_JSON_PAYLOAD.code,
    });
  } else if (err instanceof ZodError) {
    error = zodToAppException(err);
  } else {
    error = new AppException({
      exceptionType: Exceptions.INTERNAL_SERVER_ERROR,
      message: errorDefinitions.GENERAL.UNHANDLED_SERVER_ERROR.message,
      code: errorDefinitions.GENERAL.UNHANDLED_SERVER_ERROR.code,
    });

    // Log only non-operational errors
    logger.error(`Unhandled error: ${err.message}`, {
      stack: err.stack,
      path: req.originalUrl,
      error: err,
    });
  }

  // Send formatted error response
  errorResponse(res, error, req.originalUrl);
};

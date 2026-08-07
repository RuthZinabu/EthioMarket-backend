import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodObject, ZodError } from "zod";
import { zodToAppException } from "./zod-error.util";

export const validateBody =
  <T extends ZodSchema>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const strictSchema = schema instanceof ZodObject ? schema.strict() : schema;

    const result = strictSchema.safeParse(req.body);
    if (!result.success) {
      throw zodToAppException(result.error as ZodError);
    }
    req.body = result.data;
    next();
  };

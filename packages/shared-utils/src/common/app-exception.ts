import { Exceptions, errorCodes } from "./errors";

export class AppException extends Error {
  public isOperational: boolean;
  public code: string;
  public readonly statusCode: number;
  public readonly data?: unknown;

  constructor(config: {
    exceptionType: Exceptions;
    message?: string;
    code?: string;
    data?: unknown;
  }) {
    const errorConfig = errorCodes[config.exceptionType];
    super(config.message || errorConfig.message);

    this.name = config.exceptionType;
    this.code = config.code || errorConfig.code;
    this.statusCode = errorConfig.statusCode;
    this.data = config.data;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(typeof this.data === "object" && this.data !== null ? { data: this.data } : {}),
    };
  }
}

export class UnauthorizedException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.UNAUTHORIZED, ...config });
  }
}

export class ForbiddenException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.FORBIDDEN, ...config });
  }
}

export class NotFoundException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.NOT_FOUND, ...config });
  }
}

export class BadRequestException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.BAD_REQUEST, ...config });
  }
}

export class ConflictException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.CONFLICT, ...config });
  }
}

export class ValidationException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.BAD_REQUEST, ...config });
  }
}

export class InternalServerException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.INTERNAL_SERVER_ERROR, ...config });
  }
}

export class NotificationCreationFailedException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({
      exceptionType: Exceptions.NOTIFICATION_CREATION_FAILED,
      ...config,
    });
  }
}

export class NotificationNotFoundException extends AppException {
  constructor(config: { message?: string; code?: string; data?: unknown }) {
    super({ exceptionType: Exceptions.NOTIFICATION_NOT_FOUND, ...config });
  }
}

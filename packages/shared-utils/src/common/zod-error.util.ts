import { ZodError } from "zod";
import { AppException } from "./app-exception";
import { Exceptions, errorDefinitions } from "./errors";

export function zodToAppException(err: ZodError): AppException {
  // Use the first error to craft a human, concise message
  const first = err.issues[0];
  const field = first?.path?.length ? first.path.join(".") : "payload";
  const reason = first?.message || "Invalid value";

  return new AppException({
    exceptionType: Exceptions.BAD_REQUEST,
    code: errorDefinitions.GENERAL.ZOD_VALIDATION_FAILED.code,
    // Keep it short and consistent with your API messaging style
    message: `${errorDefinitions.GENERAL.ZOD_VALIDATION_FAILED.message} ${field}: ${reason}`,
    // IMPORTANT: do NOT pass `details` to keep the wire format aligned with your API
  });
}

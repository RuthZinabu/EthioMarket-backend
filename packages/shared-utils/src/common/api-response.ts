export function successResponse(data: unknown, statusCode = 200, message = "Success") {
  return {
    status: "success",
    timestamp: new Date().toISOString(),
    message,
    data,
    statusCode,
  };
}

export function formatErrorResponse(
  error: { message?: string } | Error | any,
  statusCode = 500,
  path?: string,
) {
  const message = typeof error === "string" ? error : error?.message || "Internal server error";
  return {
    status: "error",
    timestamp: new Date().toISOString(),
    message,
    path,
    statusCode,
  };
}

export function formatSuccessResponse(data: unknown, statusCode = 200) {
  return successResponse(data, statusCode);
}
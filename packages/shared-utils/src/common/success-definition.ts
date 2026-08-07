import { ApiResponse } from "../types/apiresponse";
import { successMessages } from "../types/messages";

export function throwApiSuccess(
  code: number,
  messageKey: keyof (typeof successMessages)["en"],
  lang: keyof typeof successMessages = "en",
  data: Record<string, unknown>,
) {
  const message = successMessages[lang][messageKey] || "Unknown error";

  const successResponse: ApiResponse = {
    statuscode: code,
    message,
    data,
  };
  return successResponse;
}

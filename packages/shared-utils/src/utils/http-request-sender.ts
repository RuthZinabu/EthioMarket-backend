import axios, { AxiosRequestConfig } from "axios";
import { logger } from "./logger";
export interface HttpRequestType {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  data?: Record<string, unknown> | string | any;
  headers?: Record<string, string>;
  config?: Omit<AxiosRequestConfig, "url" | "method" | "headers" | "data">;
  returnError?: boolean;
}

export async function sendHttpRequest({
  url,
  method,
  data,
  headers,
  config,
  returnError = false,
}: HttpRequestType) {
  try {
    const res = await axios({
      method,
      maxBodyLength: Infinity,
      url,
      headers,
      data: data || {},
      ...config,
      timeout: 500000,
    });
    logger.info("Http request Sent Successfully to" + url);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`HTTP error to ${url}: ${error.response?.status} - ${error.message}`);
    } else {
      logger.error(`Unknown error sending HTTP request to ${url}`, error);
    }
    return returnError ? error : null;
  }
}

// Existing shared exports
export * from "./utils";
export { RedisClient, RedisValuePairKeys } from "./redis-client";
export * from "./rabbitmq";
export { VaultService } from "./vault";
export * from "./constants";
export {
  createAuthenticate,
  type _UserToken,
  type AuthRequest,
  type AuthToken,
} from "./middleware/authenticate";
export { authorization, type RequiredPermission } from "./middleware/authorization";
export { encryptTokenInfo, generateJwtToken } from "./middleware/token";
export { customTokenVerify } from "./middleware/token-verify";

// Merged from @all-bank-network/shared
export * from "./utils/logger";
export * from "./utils/code-generator";
export * from "./utils/http-request-sender";
export * from "./utils/xml";
export * from "./utils/xml-generator";
export * from "./utils/account-lookup";
export * from "./utils/fund-transfer";
export * from "./utils/timestamp-generator";
export * from "./utils/route-prefix";
export * from "./utils/cors-origins";
export * from "./utils/format-date";
export * from "./utils/signature";
export * from "./utils/password-validator";
export * from "./utils/notification-publisher";
export * from "./utils/pagination";
export * from "./utils/date-range-query";

export * from "./common/app-exception";
export * from "./common/errors";
export * from "./common/error-middleware";
export * from "./common/validation.middleware";
export * from "./common/api-response";

export * from "./types/apiresponse";
export * from "./types/activity-log";
export * from "./types/env-config";

export * from "./assets/seaweed-client";
export * from "./assets/file-validator";
export * from "./middleware/authenticate";
export * from "./middleware/authorization";
export * from "./middleware/token";
export * from "./middleware/token-verify";
export * from "./utils/logger";
export * from "./utils/code-generator";
export * from "./utils/http-request-sender";
export * from "./utils/xml";
export * from "./utils/xml-generator";
export * from "./utils/account-lookup";
export * from "./utils/fund-transfer";
export * from "./utils/timestamp-generator";
export * from "./utils/route-prefix";
export * from "./utils/cors-origins";
export * from "./utils/format-date";
export * from "./utils/signature";
export * from "./utils/password-validator";
export * from "./types/apiresponse";
export * from "./types/activity-log";
export * from "./types/env-config";
export * from "./types/messages";

declare global {
  var _CONFIG: any;
}

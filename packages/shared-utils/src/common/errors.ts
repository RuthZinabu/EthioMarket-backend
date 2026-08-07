export enum Exceptions {
  UNAUTHORIZED = "UnauthorizedException",
  FORBIDDEN = "ForbiddenException",
  NOT_FOUND = "NotFoundException",
  BAD_REQUEST = "BadRequestException",
  CONFLICT = "ConflictException",
  INTERNAL_SERVER_ERROR = "InternalServerErrorException",
  SERVICE_UNAVAILABLE = "ServiceUnavailableException",
  NOTIFICATION_CREATION_FAILED = "NotificationCreationFailedException",
  NOTIFICATION_NOT_FOUND = "NotificationNotFoundException",
}

export const errorCodes: Record<Exceptions, { code: string; statusCode: number; message: string }> =
  {
    [Exceptions.UNAUTHORIZED]: {
      code: Exceptions.UNAUTHORIZED,
      statusCode: 401,
      message: "No authentication method provided.",
    },
    [Exceptions.FORBIDDEN]: {
      code: Exceptions.FORBIDDEN,
      statusCode: 403,
      message: "You do not have permission to access this resource.",
    },
    [Exceptions.NOT_FOUND]: {
      code: Exceptions.NOT_FOUND,
      statusCode: 404,
      message: "The requested resource was not found.",
    },
    [Exceptions.BAD_REQUEST]: {
      code: Exceptions.BAD_REQUEST,
      statusCode: 400,
      message: "The request was invalid or cannot be processed.",
    },
    [Exceptions.CONFLICT]: {
      code: Exceptions.CONFLICT,
      statusCode: 409,
      message: "A conflict occurred with the current state of the resource.",
    },
    [Exceptions.INTERNAL_SERVER_ERROR]: {
      code: Exceptions.INTERNAL_SERVER_ERROR,
      statusCode: 500,
      message: "Something went wrong. please try again",
    },
    [Exceptions.SERVICE_UNAVAILABLE]: {
      code: Exceptions.SERVICE_UNAVAILABLE,
      statusCode: 503,
      message: "The service is temporarily unavailable. Please try again later.",
    },
    [Exceptions.NOTIFICATION_CREATION_FAILED]: {
      code: "NOTIFICATION_CREATION_FAILED",
      statusCode: 500,
      message: "Failed to create notification",
    },
    [Exceptions.NOTIFICATION_NOT_FOUND]: {
      code: "NOTIFICATION_NOT_FOUND",
      statusCode: 404,
      message: "Notification not found",
    },
  };
export const errorDefinitions = {
  GENERAL: {
    MONGOOSE_CONFLICT_KEY: {
      code: "GEN_001",
      message: "Duplicate key error: The specified field already exists.",
    },
    MONGOOSE_INVALID_OBJECT_ID: {
      code: "GEN_002",
      message: "Invalid ObjectId provided.",
    },
    INVALID_JSON_PAYLOAD: {
      code: "GEN_003",
      message: "Invalid JSON payload.",
    },
    UNHANDLED_SERVER_ERROR: {
      code: "GEN_004",
      message: "Something went wrong. please try again.",
    },
    INVALID_TOKEN_FORMAT: {
      code: "GEN_005",
      message: "Invalid token format.",
    },
    INVALID_TOKEN: {
      code: "GEN_006",
      message: "Invalid token.",
    },
    EXPIRED_TOKEN: {
      code: "GEN_007",
      message: "Session has expired.",
    },
    ENCRYPTED_PAYLOAD_REQUIRED: {
      code: "GEN_008",
      message: "Encrypted payload is required.",
    },
    INVALID_SERVER_CONFIGURATION: {
      code: "GEN_009",
      message: "Invalid server configuration",
    },
    AUTH_HEADER_MISSING: {
      message: "Authorization header is missing. please provide a valid bearer token.",
      code: "GEN_010",
    },
    INVALID_KEY_CONFIGURATION: {
      code: "GEN_011",
      message: "Invalid key configuration.",
    },
    INVALID_ENCRYPTED_PAYLOAD: {
      message: "The provided encrypted payload is invalid.",
      code: "GEN_012",
    },
    DECRYPTION_ERROR: {
      code: "GEN_013",
      message: "Decryption error occurred. please check your key configuration.",
    },
    SERVER_KEYS_NOT_CONFIGURED: {
      code: "GEN_015",
      message: "server error occurred. please try again later or contact support.",
    },
    INVALID_INPUT: {
      code: "GEN_016",
      message: "the provided input is invalid.",
    },
    UNAUTHORIZED: {
      code: "GEN_016",
      message: "missing authenticated user.",
    },
    USER_REALM_NOT_FOUND: {
      code: "GEN_016",
      message: "user is not permitted to do this action.",
    },
    ACTION_NOT_ALLOWED: {
      code: "GEN_017",
      message: "user is not permitted to do this action.",
    },
    CRC_NOT_MATCHED: {
      code: "GEN_018",
      message: "CRC not matched.",
    },
    CRC_VALIDATION_FAILED: {
      code: "GEN_019",
      message: "CRC validation failed",
    },
    CRC_NOT_PROVIDED: {
      code: "GEN_020",
      message: "Missing data or CRC checksum",
    },
    CRC_MISSING_DATA: {
      code: "GEN_021",
      message: "Missing data for CRC validation",
    },
    INVALID_PAYMENT_TYPE: {
      code: "GEN_022",
      message: "Invalid payment type provided.",
    },
    ZOD_VALIDATION_FAILED: {
      code: "GEN_019",
      message: "Invalid request payload.",
    },
  },
  AUTH_MS: {
    AUTH_USER_NOT_FOUND: {
      code: "AUTH_001",
      message: "User not found.",
    },
    AUTH_USER_DISABLED: {
      code: "AUTH_002",
      message: "User is not allowed to login, please contact your admin!",
    },
    AUTH_INVALID_PASSWORD: {
      code: "AUTH_002",
      message: "Invalid password.",
    },
    AUTH_USER_HAS_NO_PASSWORD: {
      code: "AUTH_003",
      message: "Please reset your password. to login",
    },
    AUTH_USER_DISABLED_FOR_LOGIN: {
      code: "AUTH_003",
      message: "Your account is disabled for login. due to multiple login attempts.",
    },
    AUTH_TOO_MANY_ATTEMPTS: (waiting_time: number) => ({
      code: "AUTH_004",
      message: `Too many attempts. Try again after ${waiting_time} minutes`,
    }),
    AUTH_INVALID_OTP: {
      code: "AUTH_005",
      message:
        "The verification code you entered is incorrect. Please check the code and try again.",
    },
    AUTH_EXPIRED_OTP: {
      code: "AUTH_006",
      message: "The verification code has expired. Please request a new code to continue.",
    },
    AUTH_USER_RESET_PASSWORD_REQUIRED: {
      code: "AUTH_007",
      message:
        "Too many login attempts. Please reset your password. Your account is locked until then.",
    },
    AUTH_USER_ALREADY_EXISTS: (name: string) => ({
      code: "AUTH_08",
      message: `user with this ${name} already exist`,
    }),
    LOGIN_PROHIBITED_FOR_15_MIN: {
      code: "AUTH_010",
      message: "Incorrect credentials. Login is prohibited for 15 minutes.",
    },
    INCORRECT_PASSWORD: (triesLeft: number) => ({
      code: "AUTH_011",
      message: `Incorrect password. ${triesLeft} login attempt(s) left.`,
    }),
    OLD_PASSWORD_SAME_AS_NEW: {
      code: "AUTH_010",
      message: "New password can't be the same as old password.",
    },
    OLD_PASSWORD_NOT_CORRECT: {
      code: "AUTH_010",
      message: "old password is not correct",
    },
    AUTH_DEVICE_NOT_FOUND: {
      code: "AUTH_012",
      message: "Device not found.",
    },
    SESSION_EXPIRED: {
      code: "AUTH_013",
      message:
        "You are already logged in on another device. Please log out before logging in again.",
    },
    FULL_NAME_REQUIRED: {
      code: "AUTH_014",
      message: "Full name is required.",
    },
    OTP_FOR_NOT_PROVIDED: {
      code: "AUTH_015",
      message: "OTP for is required.",
    },
  },
  USER_MS: {
    INVALID_MERCHANT_COMMISSION: {
      code: "",
      message: "Invalid merchant commission.",
    },
    API_KEY_REQUIRED: {
      code: "",
      message: "API key is required.",
    },
    EXPIRED_API_KEY: {
      code: "",
      message: "API key is expired.",
    },
    INVALID_API_KEY: {
      code: "",
      message: "Invalid API key.",
    },
    MERCHANT_DISABLED: {
      code: "",
      message: "Merchant is disabled please contact your admin.",
    },
    INSTITUTION_NOT_SUPPORT_USD_TRANSACTION: {
      code: "",
      message: "the provided Institution not support usd account.",
    },
    MERCHANT_NOT_ALLOWED_TO_GENERATE_KEY: {
      code: "",
      message: "merchant is not allowed to generate erp api key.",
    },
    MERCHANT_ALREADY_ALREADY_ACTIVATED: {
      code: "",
      message: "Merchant is already activated.",
    },
    INSTITUTION_ALREADY_EXIST: (val: string) => ({
      code: "INI_001",
      message: `Institution with this ${val} already exist.`,
    }),
    MERCHANT_ALREADY_EXIST: (val: string) => ({
      code: "INI_002",
      message: `Merchant with this ${val} already exist.`,
    }),
    Agency_ALREADY_EXIST: (val: string) => ({
      code: "",
      message: `Agency with this ${val} already exist.`,
    }),
    AGENCY_NOT_FOUND: {
      code: "",
      message: "Agency not found.",
    },
    ACTION_NOT_FOUND: {
      code: "INI_003",
      message: "request action not found.",
    },
    MERCHANT_NOT_CREATED: {
      code: "INI_004",
      message: "Merchant not created.",
    },
    INSTITUTION_NOT_FOUND: {
      code: "INI_005",
      message: `Institution not found.`,
    },
    MERCHANT_NOT_FOUND: {
      code: "INI_006",
      message: `Merchant not found.`,
    },
    MERCHANT_EDIT_NOT_ALLOWED: {
      code: "",
      message: `Merchant edit is not allowed for approved merchant`,
    },
    CASHIER_NOT_FOUND: {
      code: "INI_006",
      message: `Cashier not found.`,
    },
    ETHSWITCH_CODE_REQUIRED: {
      code: "INI_007",
      message: `Ethswitch code is required`,
    },
    MERCHANT_CATEGORY_NOT_FOUND: {
      code: "MCC_001",
      message: `category  not found.`,
    },
    ET_SWITCH_ACCOUNT_LOOKUP_ERROR: {
      code: "ETS_001",
      message: `Failed to lookup account number`,
    },

    ACCOUNT_NUMBER_NOT_FOUND: (val?: string) => ({
      code: "ETS_001",
      message: `account number ${val ?? ""} not found`,
    }),
    ACCOUNT_NUMBER_ALREADY_EXIST: (val?: string, name?: string) => ({
      code: "USR_001",
      message: `account number ${val ?? ""} already linked with another ${name ?? ""}`,
    }),
    MERCHANT_DISABLED_NOT_ALLOWED: {
      code: "USR_002",
      message: `Disable merchant or cashier is not allowed you can disable the merchant instead.`,
    },
    USER_UPDATE_IS_NOT_ALLOWED: (val: string) => ({
      code: "USR_003",
      message: `updating this ${val} user is not allowed.`,
    }),
    USER_ROLE_IS_REQUIRED: {
      code: "USR_004",
      message: `user role is required`,
    },
    INVALID_ROLE: {
      code: "USR_005",
      message: "Invalid role or type provided.",
    },
    AGGREGATOR_ALREADY_EXIST: (val: string) => ({
      code: "AGG_001",
      message: `Aggregator with this ${val} already exist.`,
    }),
    AGGREGATOR_NOT_FOUND: {
      code: "AGG_002",
      message: `Merchant Aggregator not found.`,
    },
    RULE_ENGINE_NOT_FOUND: {
      code: "RE_001",
      message: `Default rule Engine not found.`,
    },
    INVALID_PAYMENT_METHODS: {
      code: "RE_001",
      message: `invalid payment methods provided.`,
    },
    INVALID_INSTITUTIONS_METHODS: {
      code: "RE_001",
      message: `invalid payment options provided.`,
    },
    INVALID_USD_ACCOUNT_NUMBER: {
      code: "RE_001",
      message: `the account number is not valid usd account number.`,
    },
    ACTION_ALREADY_PENDING: {
      code: "RE_001",
      message: "pending action already exist.",
    },
    EXCEL_CSV_FILE_REQUIRED: {
      code: "",
      message: "Excel csv file is required.",
    },
  },
  CUSTOMER: {
    CUSTOMER_NOT_FOUND: {
      code: "CUS_001",
      message: "Customer not found.",
    },
    CUSTOMER_ALREADY_EXISTS: (val?: string) => ({
      code: "CUS_002",
      message: `Customer with ${val ?? "this identifier"} already exists.`,
    }),
    KYC_DOCUMENT_REQUIRED: {
      code: "CUS_003",
      message: "KYC document is required.",
    },
    INVALID_KYC_DOCUMENT: {
      code: "CUS_004",
      message: "Provided KYC document is invalid.",
    },
    EXCEL_CSV_FILE_REQUIRED: {
      code: "CUS_005",
      message: "Excel or CSV file is required.",
    },
    ACCOUNT_NUMBER_ALREADY_EXIST: (val?: string) => ({
      code: "CUS_006",
      message: `Account number ${val ?? ""} is already linked with another customer.`,
    }),
    CUSTOMER_CREATION_FAILED: {
      code: "CUS_007",
      message: "Failed to create customer.",
    },
    CUSTOMER_UPDATE_FAILED: {
      code: "CUS_008",
      message: "Failed to update customer details.",
    },
    CUSTOMER_FILE_UPLOAD_FAILED: {
      code: "CUS_009",
      message: "Failed to upload customer file. Please try again.",
    },
    CUSTOMER_ACTION_NOT_FOUND: {
      code: "INI_010",
      message: "request action not found.",
    },
    CUSTOMER_ACTION_ALREADY_PENDING: {
      code: "INI_010",
      message: "request action already found.",
    },
    CUSTOMER_FYDA_ERROR: (message?: string, existingKycData?: any) => ({
      code: "CUS_010",
      message: `Fayda customer info processing error.${message ?? ""}`,
      existingKycData,
    }),
  },
  CUSTOMER_DOC: {
    FRONT_DOCUMENT_REQUIRED: {
      code: "CUS_DOC_001",
      message: "Front page of the document is required",
    },
    BACK_DOCUMENT_REQUIRED: (docType: string) => ({
      code: "CUS_DOC_002",
      message: `Back page is required for document type: ${docType}`,
    }),
    DOCUMENT_NOT_FOUND: {
      code: "CUS_DOC_003",
      message: "KYC document not found",
    },
    CUSTOMER_NOT_FOUND: {
      code: "CUS_DOC_004",
      message: "Customer not found",
    },
    CUSTOMER_FYDA_DATA_ERROR: {
      code: "CUS_DOC_005",
      message: "Invalid Fayda Data Error",
    },
  },
  TXN_MS: {
    MERCHANT_SPONSOR_INSTITUTION_NOT_FOUND: {
      code: "TXN_001",
      message: "Merchant sponsor institution not found.",
    },
    BILL_REF_NO_UNIQUE_ERROR: {
      code: "TXN_006",
      message: "Bill reference number must be unique.",
    },
    TRANSACTION_NOT_FOUND: {
      code: "TXN_001",
      message: "Transaction not found.",
    },
    INSUFFICIENT_FUNDS: {
      code: "TXN_002",
      message: "Insufficient balance.",
    },
    FAILED_TO_UPDATE_TRANSACTION_STATUS: {
      code: "TXN_003",
      message: "Failed to update transaction status.",
    },
    TRANSACTION_EXPIRED: {
      code: "TXN_004",
      message: "Transaction is expired.",
    },
    INVALID_AMOUNT: {
      code: "TXN_005",
      message: "Invalid amount",
    },
    COMMISSION_NOT_FOUND: {
      code: "COM_001",
      message: "Commission not found",
    },
    DUPLICATE_COMMISSION_FOUND: {
      code: "COM_002",
      message: "Duplicate commission found",
    },
    CUSTOMER_NOT_FOUND: {
      code: "CUS_001",
      message: "Customer not found",
    },
    INSTITUTION_NOT_FOUND: {
      code: "INI_001",
      message: `Institution not found.`,
    },
  },
  NOTIFICATION: {
    NOTIFICATION_CREATION_FAILED: {
      code: "NOT_001",
      message: "Failed to create notification.",
    },
    NOTIFICATION_NOT_FOUND: {
      code: "NOT_002",
      message: "Notification not found.",
    },
    NOTIFICATION_REQUIRED_FIELD_MISSING: (val?: string) => ({
      code: "NOT_003",
      message: `Notification field ${val ?? ""} is required.`,
    }),
  },
  OTP_MS: {
    OTP_ACCOUNT_NUMBER_REQUIRED: {
      code: "OTP_001",
      message: "Account number is required.",
    },
    OTP_ACCOUNT_VALIDATION_FAILED: {
      code: "OTP_002",
      message: "Account number validation failed.",
    },
    OTP_ACCOUNT_LOOKUP_FAILED: {
      code: "OTP_003",
      message: "Account lookup failed.",
    },
    OTP_ACCOUNT_API_ERROR: {
      code: "OTP_004",
      message: "Error occurred while checking account.",
    },
    OTP_TRANSACTION_VALIDATION_FAILED: {
      code: "OTP_005",
      message: "Transaction validation failed.",
    },
    OTP_INSTITUTION_ID_INVALID: {
      code: "OTP_006",
      message: "Invalid Institution ID format.",
    },
    OTP_AUTH_HEADER_MISSING: {
      code: "OTP_007",
      message: "Authorization token is required.",
    },
    OTP_TRANSACTION_CREATION_FAILED: {
      code: "OTP_008",
      message: "Transaction failed please try again.",
    },
    OTP_BALANCE_CHECK_FAILED: {
      code: "OTP_009",
      message: "Balance check failed.",
    },
    OTP_BALANCE_API_ERROR: {
      code: "OTP_010",
      message: "Error occurred while checking balance.",
    },
    OTP_TRANSACTION_NOT_FOUND: {
      code: "OTP_011",
      message: "Transaction not found.",
    },
    OTP_TRANSACTION_ALREADY_PROCESSED: {
      code: "OTP_012",
      message: "Transaction is already processed.",
    },
    OTP_FUND_TRANSFER_FAILED: {
      code: "OTP_013",
      message: "Fund transfer failed.",
    },
    OTP_FUND_TRANSFER_API_ERROR: {
      code: "OTP_014",
      message: "Error occurred during fund transfer.",
    },
    OTP_TRANSACTION_UPDATE_FAILED: {
      code: "OTP_015",
      message: "Failed to update transaction.",
    },
    OTP_AMOUNT_MISMATCH: {
      code: "OTP_016",
      message: "Amount mismatch between expected and received.",
    },
    OTP_EMONEY_API_FAILED: {
      code: "OTP_017",
      message: "eMoney processing failed.",
    },
    OTP_EMONEY_API_ERROR: {
      code: "OTP_018",
      message: "Error occurred while calling eMoney API.",
    },
    OTP_INTERNAL_ERROR: {
      code: "OTP_019",
      message: "Internal error occurred during transaction approval.",
    },
    OTP_REPROCESS_VALIDATION_FAILED: {
      code: "OTP_019",
      message: "Reprocess transaction validation failed.",
    },
    OTP_REPROCESS_TRANSACTION_NOT_FOUND: {
      code: "OTP_020",
      message: "Transaction not found for reprocessing.",
    },
    OTP_REPROCESS_TRANSACTION_ALREADY_HANDLED: {
      code: "OTP_021",
      message: "Transaction is already processed or not eligible for retry.",
    },
    OTP_REPROCESS_FETCH_FAILED: {
      code: "OTP_022",
      message: "Failed to fetch transaction for reprocessing.",
    },
    OTP_REPROCESS_RESEND_FAILED: {
      code: "OTP_023",
      message: "Failed to resend OTP during reprocessing.",
    },
    OTP_REPROCESS_RESEND_ERROR: {
      code: "OTP_024",
      message: "Error occurred while resending OTP.",
    },
    OTP_CODE_INVALID_OR_EXPIRED: {
      code: "OTP_026",
      message: "The OTP code is invalid or has expired.",
    },
    OTP_INSTITUTION_NOT_FOUND: {
      code: "OTP_027",
      message: "Institution not found.",
    },
  },
  APIKEY_MS: {
    INVALID_APIKEY_ID: {
      code: "APIKEY_001",
      message: "The provided API key ID is invalid.",
    },
    INVALID_USER_ID: {
      code: "APIKEY_002",
      message: "The provided user ID is invalid.",
    },
    APIKEY_NOT_FOUND: {
      code: "APIKEY_003",
      message: "The requested API key was not found.",
    },
    UNAUTHORIZED_APIKEY_REGENERATION: {
      code: "APIKEY_004",
      message: "You are not authorized to regenerate this API key.",
    },
    NOT_LATEST_ACTIVE_APIKEY: {
      code: "APIKEY_005",
      message: "Only the latest active API key can be regenerated.",
    },
    FAILED_TO_EXPIRE_OLD_KEY: {
      code: "APIKEY_006",
      message: "Failed to expire the old API key.",
    },
    FAILED_TO_GENERATE_KEYS: {
      code: "APIKEY_007",
      message: "Failed to generate new API keys.",
    },
    FAILED_TO_SAVE_NEW_KEY: {
      code: "APIKEY_008",
      message: "Failed to save the new API key.",
    },
    FAILED_TO_UPDATE_MERCHANT_KEYS: {
      code: "APIKEY_009",
      message: "Failed to update the merchant with the new API key.",
    },
    APIKEY_FETCH_FAILED: {
      code: "APIKEY_010",
      message: "Failed to fetch API keys for the user.",
    },
    MERCHANT_NOT_FOUND_BY_CODE: {
      code: "APIKEY_011",
      message: "Merchant not found with the provided merchant code.",
    },
    APIKEY_FETCH_BY_MERCHANT_FAILED: {
      code: "APIKEY_012",
      message: "Failed to fetch API keys for the merchant.",
    },
    INVALID_ORGANIZATION_ID: {
      code: "APIKEY_013",
      message: "Invalid organization ID provided.",
    },
    API_KEY_NOT_FOUND: {
      code: "APIKEY_014",
      message: "API key not found.",
    },
    MAXIMUM_APIKEY_LIMIT_REACHED: {
      code: "APIKEY_015",
      message:
        "Maximum active API keys limit (3) reached. Please expire one to generate a new key.",
    },
  },

  PERMISSION_MS: {
    DEPARTMENT_NOT_FOUND: {
      code: "DEP_001",
      message: "Department not found.",
    },
    DEPARTMENT_ALREADY_EXISTS: (name: string) => ({
      code: "DEP_002",
      message: `Department with name ${name} already exists.`,
    }),
    DEPARTMENT_CREATION_FAILED: {
      code: "DEP_003",
      message: "Failed to create department.",
    },
    DEPARTMENT_UPDATE_FAILED: {
      code: "DEP_004",
      message: "Failed to update department.",
    },

    DEPARTMENT_APPROVAL_FAILED: {
      code: "DEP_005",
      message: "Failed to approve department request.",
    },

    DEPARTMENT_REQUIRED: {
      code: "DEP_006",
      message: "Department is required.",
    },

    PERMISSION_GROUP_NOT_FOUND: {
      code: "PERM_GROUP_001",
      message: "Permission group not found.",
    },

    PERMISSION_GROUP_ALREADY_EXISTS: (name: string) => ({
      code: "PERM_002",
      message: `Permission group with name ${name} already exists.`,
    }),
    PERMISSION_GROUP_CREATION_FAILED: {
      code: "PERM_GROUP_003",
      message: "Failed to create permission group.",
    },
    PERMISSION_GROUP_UPDATE_FAILED: {
      code: "PERM_GROUP_004",
      message: "Failed to update permission group.",
    },

    PERMISSION_GROUP_APPROVAL_FAILED: {
      code: "PERM_GROUP_005",
      message: "Failed to approve permission group request.",
    },

    PERMISSION_GROUP_REQUIRED: {
      code: "PERM_GROUP_006",
      message: "Permission group is required.",
    },

    DEFAULT_PERMISSION_GROUP_CANNOT_BE_UPDATED: {
      code: "PERM_GROUP_006",
      message: "Default Permission Group cannot be updated",
    },

    PERMISSION_NOT_FOUND: {
      code: "PERM_001",
      message: "Permission not found.",
    },

    PERMISSION_MISSING: {
      code: "PERM_002",
      message: "Some permissions were not found.",
    },

    ACTION_NOT_FOUND: {
      code: "PERM_003",
      message: "Action not found.",
    },

    ROLE_PERMISSION_GROUP_CONFLICT: {
      code: "PERM_004",
      message: "Provided role conflicts with existing permission group role.",
    },

    PERMISSION_REQUIRED: {
      code: "PERM_005",
      message: "Permission is required.",
    },

    INVALID_PERMISSIONS: {
      code: "PERM_006",
      message: "Some permissions are invalid.",
    },
  },

  SETTLEMENT_MS: {
    WALLET_NOT_FOUND: {
      code: "SETTLEMENT_001",
      message: "Wallet not found.",
    },
    WITHDRAW_NOT_FOUND: {
      code: "SETTLEMENT_005",
      message: "transaction data not found.",
    },
    EMONEY_ALREADY_EXISTS: {
      code: "SETTLEMENT_006",
      message: "emoney already issued for this transaction",
    },
    DUPLICATE_WITHDRAWAL: {
      message: "Duplicate withdrawal request please try again.",
      code: "SETTLEMENT_007",
    },
  },

  SYS_CONFIG_MS: {
    USER_NOT_FOUND: {
      code: "SYS_CONFG_001",
      message: "User not found.",
    },
    PASSWORD_NOT_PROVIDED: {
      code: "SYS_CONFG_002",
      message: "Password is required.",
    },
    USER_INACTIVE: {
      code: "SYS_CONFG_003",
      message: "User account is locked. please contact support.",
    },
    UNAUTHORIZED_ACCESS: {
      code: "SYS_CONFG_004",
      message: "Unauthorized access. you don't have permission to perform this action.",
    },
    ACCOUNT_DISABLED: (val?: number) => ({
      code: "SYS_CONFG_005",
      message: `Too many failed attempts. please try again after ${val} minutes.`,
    }),
    ACCOUNT_LOCKED: {
      code: "SYS_CONFG_006",
      message:
        "Your account has been locked due to multiple failed login attempts. please contact support.",
    },
    PASSWORD_VERIFICATION_FAILED: {
      code: "SYS_CONFG_007",
      message: "Password verification failed. please try again.",
    },
    PASSWORD_VERIFIED_SUCCESSFULLY: {
      code: "SYS_CONFG_008",
      message: "Password verified successfully.",
    },
    TIERS_NOT_PROVIDED: {
      code: "SYS_CONFG_009",
      message: "Tiers must be a non-empty array",
    },
    ABOVE_VALUE_NOT_PROVIDED: {
      code: "SYS_CONFG_010",
      message: "Above value and authorization_type are required",
    },
    TIER_VALIDATION_FAILED: (val: string) => ({
      code: "SYS_CONFG_011",
      message: `Tier validation failed: ${val}`,
    }),
    RULE_ENGINE_DISABLED_EXISTING_RULE: (val: string) => ({
      code: "SYS_CONFG_012",
      message: `An existing rule with the same ${val} type is found but it is currently disabled. Please enable the existing rule or modify the new rule to use a different type.`,
    }),
    RULE_ENGINE_EXISTING_RULE: (val: string, action?: string) => ({
      code: "SYS_CONFG_013",
      message: `An existing active ${action || "rule"} with the same type (${val}) already exists for the given product.`,
    }),
    PENDING_ACTION_EXISTING_RULE: (val: string) => ({
      code: "SYS_CONFG_014",
      message: `A pending action for (${val}) already exists for the given product please wait for checker approval.`,
    }),
    RULE_ENGINE_NOT_FOUND: (val: string) => ({
      code: "SYS_CONFG_015",
      message: `${val} Not found`,
    }),
    PENDING_CHECKER_APPROVAL: (val: string) => ({
      code: "  SYS_CONFIG_016",
      message: `There is already a pending  request for (${val}). Please wait for checker approval.`,
    }),
    CRUD_ERROR: (val: string) => ({
      code: "SYS_CONFIG_017",
      message: `Error when (${val})  rule please try again.`,
    }),
    MISSING_REQUIRED_FIELD: (val: string) => ({
      code: "SYS_CONFIG_018",
      message: `Missing required fields: ${val}`,
    }),
    ERROR_MESSAGE_DELETE_ENABLE: (val: string) => ({
      code: "SYS_CONFIG_019",
      message: `${val} is already deleted or disabled you can not update it right now please enable it again.`,
    }),

    INVALID_TRANSFER_LIMIT: (val: string) => ({
      code: "SYS_CONFIG_020",
      message: `Invalid transfer limit configuration: ${val}`,
    }),
    SERVER_ERROR: (val: string) => ({
      code: "SYS_CONFIG_021",
      message: `Server Error: ${val}`,
    }),
    GENERAL_ERROR: (val: string) => ({
      code: "SYS_CONFIG_022",
      message: `${val}`,
    }),
  },
} as const;

export type ErrorCode = keyof typeof errorDefinitions;

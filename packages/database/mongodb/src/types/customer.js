"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerProfileSchema = exports.createCustomerSchema = exports.CustomerEmploymentStatus = exports.CustomerSex = exports.CustomerKYCLevel = exports.CustomerStatus = void 0;
const zod_1 = __importDefault(require("zod"));
var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "ACTIVE";
    CustomerStatus["PENDING"] = "PENDING";
    CustomerStatus["INACTIVE"] = "INACTIVE";
    CustomerStatus["DORMANT"] = "DORMANT";
    CustomerStatus["DISABLED"] = "DISABLED";
    CustomerStatus["LOCKED"] = "LOCKED";
    CustomerStatus["SUSPENDED"] = "SUSPENDED";
    CustomerStatus["KYC_ENFORCED"] = "KYC_ENFORCED";
})(CustomerStatus || (exports.CustomerStatus = CustomerStatus = {}));
var CustomerKYCLevel;
(function (CustomerKYCLevel) {
    CustomerKYCLevel["LEVEL_ONE"] = "1";
    CustomerKYCLevel["LEVEL_TWO"] = "2";
})(CustomerKYCLevel || (exports.CustomerKYCLevel = CustomerKYCLevel = {}));
var CustomerSex;
(function (CustomerSex) {
    CustomerSex["Male"] = "Male";
    CustomerSex["Female"] = "Female";
})(CustomerSex || (exports.CustomerSex = CustomerSex = {}));
var CustomerEmploymentStatus;
(function (CustomerEmploymentStatus) {
    CustomerEmploymentStatus["FULL_TIME"] = "full-time";
    CustomerEmploymentStatus["PART_TIME"] = "part-time";
    CustomerEmploymentStatus["SELF_EMPLOYED"] = "self-employed";
    CustomerEmploymentStatus["UNEMPLOYED"] = "unemployed";
    CustomerEmploymentStatus["STUDENT"] = "student";
    CustomerEmploymentStatus["RETIRED"] = "retired";
    CustomerEmploymentStatus["FREELANCE"] = "freelance";
    CustomerEmploymentStatus["INTERN"] = "intern";
    CustomerEmploymentStatus["CONTRACT"] = "contract";
    CustomerEmploymentStatus["OTHER"] = "other";
})(CustomerEmploymentStatus || (exports.CustomerEmploymentStatus = CustomerEmploymentStatus = {}));
exports.createCustomerSchema = zod_1.default.object({
    fullName: zod_1.default.string().min(2, "Full name is required").trim(),
    phone_number: zod_1.default
        .string()
        .startsWith("+251", { message: "Invalid phone number" })
        .length(13, { message: "Phone number must be 13 characters including +" }),
    email: zod_1.default.union([zod_1.default.string().email({ message: "Invalid email" }), zod_1.default.literal("")]).optional(),
    password: zod_1.default.string().min(6).optional(),
    pin: zod_1.default.string().length(4).optional(),
});
exports.updateCustomerProfileSchema = zod_1.default.object({
    fullName: zod_1.default.string().min(2, "Full name is required").trim().optional(),
    email: zod_1.default.union([zod_1.default.string().email(), zod_1.default.literal("")]).optional(),
    avatar: zod_1.default.string().optional(),
});
//# sourceMappingURL=customer.js.map
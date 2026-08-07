"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const institution_1 = require("../types/institution");
const institutionSchema = new mongoose_1.default.Schema({
    name: { type: String, trim: true },
    institutionType: {
        type: String,
        enum: Object.values(institution_1.InstitutionType),
        required: true,
    },
    phoneNumber: { type: String, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    etSwitchCode: { type: String },
    swiftCode: { type: String },
    logo: { type: String },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_model_1.default.modelName,
    },
    lastModifiedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_model_1.default.modelName,
    },
    businessDetail: {
        tinNumber: { type: String, trim: true, index: true },
        nationalId: { type: String, trim: true },
        businessLicense: { type: String, trim: true },
        signedAgreement: { type: String, trim: true },
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
institutionSchema.index({ enabled: 1, isDeleted: 1 });
const InstitutionModel = mongoose_1.default.model("Institution", institutionSchema);
exports.default = InstitutionModel;
//# sourceMappingURL=institution.model.js.map
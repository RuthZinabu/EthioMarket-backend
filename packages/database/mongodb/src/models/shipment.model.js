"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ShipmentUpdateSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String },
});
const ShipmentSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, index: true },
    carrier: { type: String, required: true, default: "DHL" },
    trackingNumber: { type: String, required: true, unique: true, index: true },
    recipient: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String },
        phone: { type: String },
    },
    weight: { type: Number, required: true, default: 1.0 },
    status: {
        type: String,
        enum: ["created", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
        default: "created",
        index: true,
    },
    estimatedDelivery: { type: Date },
    updates: [ShipmentUpdateSchema],
}, { timestamps: true });
const ShipmentModel = mongoose_1.default.model("Shipment", ShipmentSchema);
exports.default = ShipmentModel;
//# sourceMappingURL=shipment.model.js.map
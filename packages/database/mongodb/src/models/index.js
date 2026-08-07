"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerKycModel = exports.PermissionModel = exports.InstitutionModel = exports.ShipmentModel = exports.PaymentModel = exports.OrderModel = exports.CartModel = exports.ProductModel = exports.PermissionGroupModel = exports.CustomerModel = exports.UserModel = void 0;
const user_model_1 = __importDefault(require("./user.model"));
exports.UserModel = user_model_1.default;
const customer_model_1 = __importDefault(require("./customer.model"));
exports.CustomerModel = customer_model_1.default;
const permission_group_model_1 = __importDefault(require("./permission-group.model"));
exports.PermissionGroupModel = permission_group_model_1.default;
const product_model_1 = __importDefault(require("./product.model"));
exports.ProductModel = product_model_1.default;
const cart_model_1 = __importDefault(require("./cart.model"));
exports.CartModel = cart_model_1.default;
const order_model_1 = __importDefault(require("./order.model"));
exports.OrderModel = order_model_1.default;
const payment_model_1 = __importDefault(require("./payment.model"));
exports.PaymentModel = payment_model_1.default;
const shipment_model_1 = __importDefault(require("./shipment.model"));
exports.ShipmentModel = shipment_model_1.default;
const institution_model_1 = __importDefault(require("./institution.model"));
exports.InstitutionModel = institution_model_1.default;
const permission_model_1 = __importDefault(require("./permission.model"));
exports.PermissionModel = permission_model_1.default;
const customerKyc_model_1 = __importDefault(require("./customerKyc.model"));
exports.CustomerKycModel = customerKyc_model_1.default;
//# sourceMappingURL=index.js.map
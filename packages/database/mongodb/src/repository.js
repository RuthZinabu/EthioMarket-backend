"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDb = exports.checkReplicaSetStatus = exports.checkDbHealth = exports.connectDb = exports.permissionGroupRepository = exports.institutionRepository = exports.permissionRepository = exports.customerRepository = exports.userRepository = void 0;
const mongo_base_repo_1 = __importDefault(require("./lib/mongo-base-repo"));
const customer_model_1 = __importDefault(require("./models/customer.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const permission_model_1 = __importDefault(require("./models/permission.model"));
const institution_model_1 = __importDefault(require("./models/institution.model"));
const models_1 = require("./models");
const userRepository = new mongo_base_repo_1.default(user_model_1.default);
exports.userRepository = userRepository;
const customerRepository = new mongo_base_repo_1.default(customer_model_1.default);
exports.customerRepository = customerRepository;
const permissionRepository = new mongo_base_repo_1.default(permission_model_1.default);
exports.permissionRepository = permissionRepository;
const institutionRepository = new mongo_base_repo_1.default(institution_model_1.default);
exports.institutionRepository = institutionRepository;
const permissionGroupRepository = new mongo_base_repo_1.default(models_1.PermissionGroupModel);
exports.permissionGroupRepository = permissionGroupRepository;
var db_config_1 = require("./lib/db-config");
Object.defineProperty(exports, "connectDb", { enumerable: true, get: function () { return db_config_1.connectDb; } });
Object.defineProperty(exports, "checkDbHealth", { enumerable: true, get: function () { return db_config_1.checkDbHealth; } });
Object.defineProperty(exports, "checkReplicaSetStatus", { enumerable: true, get: function () { return db_config_1.checkReplicaSetStatus; } });
Object.defineProperty(exports, "closeDb", { enumerable: true, get: function () { return db_config_1.closeDb; } });
//# sourceMappingURL=repository.js.map
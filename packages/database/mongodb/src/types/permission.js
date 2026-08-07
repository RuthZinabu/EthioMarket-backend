"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleActionMap = exports.ActionRequestStatus = exports.ActionRequestOperation = exports.ActionResourceType = exports.PermissionRole = exports.PermissionAction = exports.PermissionModule = void 0;
var PermissionModule;
(function (PermissionModule) {
    PermissionModule["CUSTOMER"] = "Customer";
    PermissionModule["LEDGER"] = "Ledger";
    PermissionModule["AGENT"] = "Agent";
    PermissionModule["PAYABLE_RECEIVABLE"] = "Payable / Receivable";
    PermissionModule["RULE_ENGINE"] = "Rule Engine";
    PermissionModule["RECONCILIATION"] = "Reconciliation";
    PermissionModule["PERMISSION_GROUP"] = "Permission Group";
    PermissionModule["USER"] = "User";
    PermissionModule["AUDIT_LOG"] = "Audit Log";
    PermissionModule["DEPARTMENT"] = "Department";
    PermissionModule["FINANCIAL_INSTITUTION"] = "Financial Institution";
})(PermissionModule || (exports.PermissionModule = PermissionModule = {}));
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "Create";
    PermissionAction["READ"] = "Read";
    PermissionAction["UPDATE"] = "Update";
    PermissionAction["DISABLE"] = "Disable";
    PermissionAction["APPROVE"] = "Approve";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
var PermissionRole;
(function (PermissionRole) {
    PermissionRole["MAKER"] = "Maker";
    PermissionRole["CHECKER"] = "Checker";
    PermissionRole["FULL_AUTHORIZER"] = "FullAuthorizer";
})(PermissionRole || (exports.PermissionRole = PermissionRole = {}));
var ActionResourceType;
(function (ActionResourceType) {
    ActionResourceType["CUSTOMER"] = "Customer";
    ActionResourceType["LEDGER"] = "Ledger";
    ActionResourceType["AGENT"] = "Agent";
    ActionResourceType["PAYABLE_RECEIVABLE"] = "Payable / Receivable";
    ActionResourceType["RULE_ENGINE"] = "Rule Engine";
    ActionResourceType["RECONCILIATION"] = "Reconciliation";
    ActionResourceType["PERMISSION_GROUP"] = "Permission Group";
    ActionResourceType["USER"] = "User";
    ActionResourceType["AUDIT_LOG"] = "Audit Log";
    ActionResourceType["DEPARTMENT"] = "Department";
    ActionResourceType["FINANCIAL_INSTITUTION"] = "Financial Institution";
})(ActionResourceType || (exports.ActionResourceType = ActionResourceType = {}));
var ActionRequestOperation;
(function (ActionRequestOperation) {
    ActionRequestOperation["CREATE"] = "Create";
    ActionRequestOperation["UPDATE"] = "Update";
    ActionRequestOperation["ENABLE"] = "Enable";
    ActionRequestOperation["DISABLE"] = "Disable";
    ActionRequestOperation["DELETE"] = "Delete";
})(ActionRequestOperation || (exports.ActionRequestOperation = ActionRequestOperation = {}));
var ActionRequestStatus;
(function (ActionRequestStatus) {
    ActionRequestStatus["PENDING"] = "Pending";
    ActionRequestStatus["APPROVED"] = "Approved";
    ActionRequestStatus["REJECTED"] = "Rejected";
})(ActionRequestStatus || (exports.ActionRequestStatus = ActionRequestStatus = {}));
exports.roleActionMap = {
    [PermissionRole.MAKER]: [PermissionAction.CREATE, PermissionAction.READ, PermissionAction.UPDATE],
    [PermissionRole.CHECKER]: [PermissionAction.READ, PermissionAction.APPROVE],
    [PermissionRole.FULL_AUTHORIZER]: [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.APPROVE,
        PermissionAction.DISABLE,
    ],
};
//# sourceMappingURL=permission.js.map
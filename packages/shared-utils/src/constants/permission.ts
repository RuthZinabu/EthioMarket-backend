import { PermissionAction, PermissionModule } from "@emacare/mongo/types";

function createCrudPermissions(module: PermissionModule) {
  return {
    CREATE: { name: module, action: PermissionAction.CREATE },
    READ: { name: module, action: PermissionAction.READ },
    UPDATE: { name: module, action: PermissionAction.UPDATE },
    DISABLE: { name: module, action: PermissionAction.DISABLE },
    APPROVE: { name: module, action: PermissionAction.APPROVE },
  } as const;
}

export const PERMISSIONS = {
  CUSTOMER: createCrudPermissions(PermissionModule.CUSTOMER),
  LEDGER: createCrudPermissions(PermissionModule.LEDGER),
  AGENT: createCrudPermissions(PermissionModule.AGENT),
  PAYABLE_RECEIVABLE: createCrudPermissions(PermissionModule.PAYABLE_RECEIVABLE),
  RULE_ENGINE: createCrudPermissions(PermissionModule.RULE_ENGINE),
  RECONCILIATION: createCrudPermissions(PermissionModule.RECONCILIATION),
  PERMISSION_GROUP: createCrudPermissions(PermissionModule.PERMISSION_GROUP),
  USER: createCrudPermissions(PermissionModule.USER),
  AUDIT_LOG: createCrudPermissions(PermissionModule.AUDIT_LOG),
  DEPARTMENT: createCrudPermissions(PermissionModule.DEPARTMENT),
  FINANCIAL_INSTITUTION: createCrudPermissions(PermissionModule.FINANCIAL_INSTITUTION),
} as const;

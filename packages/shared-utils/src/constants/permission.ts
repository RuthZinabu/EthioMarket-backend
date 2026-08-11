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
  VENDOR: createCrudPermissions(PermissionModule.VENDOR),
  VENDOR_PAYOUT: createCrudPermissions(PermissionModule.VENDOR_PAYOUT),
  PRODUCT: createCrudPermissions(PermissionModule.PRODUCT),
  ORDER: createCrudPermissions(PermissionModule.ORDER),
  SHIPMENT: createCrudPermissions(PermissionModule.SHIPMENT),
  PERMISSION_GROUP: createCrudPermissions(PermissionModule.PERMISSION_GROUP),
  USER: createCrudPermissions(PermissionModule.USER),
  AUDIT_LOG: createCrudPermissions(PermissionModule.AUDIT_LOG),
  DEPARTMENT: createCrudPermissions(PermissionModule.DEPARTMENT),
} as const;

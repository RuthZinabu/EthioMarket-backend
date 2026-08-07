import { PermissionAction, permissionRepository, Realm, UserRole } from "@emacare/mongo";

export function getActionsByRole(role: UserRole): PermissionAction[] {
  switch (role) {
    case UserRole.Maker:
      return [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.DISABLE,
      ];

    case UserRole.Checker:
      return [PermissionAction.READ, PermissionAction.APPROVE];

    case UserRole.FullAuthorizer:
      return Object.values(PermissionAction);

    default:
      return [PermissionAction.READ];
  }
}

export async function getAdditionalPermissions(realm: Realm, role: UserRole) {
  const permissions = await permissionRepository.find({
    realm,
  });

  const actions = getActionsByRole(role);

  return permissions
    ? permissions.map((permission: any) => ({
        permission: permission._id,
        actions,
      }))
    : [];
}

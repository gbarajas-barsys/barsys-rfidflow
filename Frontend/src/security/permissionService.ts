export const hasPermission = (
  permissions: string[],
  permission: string
): boolean => {

  if (permissions.includes("*")) {
    return true;
 }

  return permissions.includes(permission);
};

export const hasAnyPermission = (
  permissions: string[],
  requiredPermissions: string[]
): boolean => {

  if (permissions.includes("*")) {
    return true;
  }

  return requiredPermissions.some(
    permission =>
      permissions.includes(permission)
  );
};
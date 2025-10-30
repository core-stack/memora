import { Permission } from "./types";

export const can = (userPermissions: Permission[] | number, requiredPermissions: Permission[] | number) => {
  userPermissions = Array.isArray(userPermissions) ?
    userPermissions :
    numberToPermissions(userPermissions);

  requiredPermissions = Array.isArray(requiredPermissions) ?
    requiredPermissions :
    numberToPermissions(requiredPermissions);

  if (requiredPermissions.length === 0) return true;

  return requiredPermissions.every((requiredPermission) => userPermissions.includes(requiredPermission));
}

export function numberToPermissions(value: number): Permission[] {
  return Object.values(Permission)
    .filter(p => typeof p === 'number' && (value & (p as number)))
    .map(p => p as Permission);
}

export function mergePermissions(...permissions: (Permission[] | number)[]): Permission[] {
  const merged = permissions.reduce((acc, p) => {
    let permissions: Permission[] = [];
    if (Array.isArray(acc)) {
      permissions = acc;
    } else {
      permissions = numberToPermissions(acc);
    }

    if (Array.isArray(p)) {
      return [...permissions, ...p];
    } else {
      return [...permissions, ...numberToPermissions(p)];
    }
  }, [] as Permission[]);
  return Array.from(new Set(Array.isArray(merged) ? merged : numberToPermissions(merged)));
}

export function permissionsToNumber(perms: Permission[]): number {
  return perms.reduce((acc, p) => acc | p, 0);
}

export * from "./types";
export * from "./roles";
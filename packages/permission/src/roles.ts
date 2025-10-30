import { z } from "zod";

import global from "./roles/global-roles.json";
import tenant from "./roles/tenant-roles.json";

import { Permission } from "./types";

const permissionKeys = Object.keys(Permission).filter(k => isNaN(Number(k)));

const stringToPermission = z.enum(permissionKeys as [keyof typeof Permission])
  .transform(key => Permission[key]);

export const roleSchema = z.object({
  key: z.string(),
  name: z.string(),
  permissions: z.array(stringToPermission),
  scope: z.enum(["GLOBAL", "TENANT"]),
  default: z.enum([ "admin", "user", "tenant-admin", "tenant-user" ]).optional(),
});
export type RoleSchema = z.infer<typeof roleSchema>;

const rolesSchema = z.array(roleSchema).superRefine((roles, ctx) => {
  const seen = new Set<string>();

  for (const role of roles) {
    const key = `${role.scope}-${role.key}`;
    if (seen.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicated key '${role.key}' in scope '${role.scope}'`,
        path: [roles.indexOf(role), "key"]
      });
    }
    seen.add(key);
  }
});
export type RolesSchema = z.infer<typeof rolesSchema>;

const defaultGlobalRoles = rolesSchema.parse(global);
const defaultTenantRoles = rolesSchema.parse(tenant);

const defaultGlobalAdminRole = defaultGlobalRoles.find(role => role.default === "admin");
const defaultGlobalUserRole = defaultGlobalRoles.find(role => role.default === "user");
const defaultTenantAdminRole = defaultTenantRoles.find(role => role.default === "tenant-admin");
const defaultTenantUserRole = defaultTenantRoles.find(role => role.default === "tenant-user");

export const ROLES = Object.freeze({
  global: {
    default: defaultGlobalRoles as RolesSchema,
    admin: defaultGlobalAdminRole as RoleSchema,
    user: defaultGlobalUserRole as RoleSchema,
  },
  tenant: {
    default: defaultTenantRoles as RolesSchema,
    admin: defaultTenantAdminRole as RoleSchema,
    user: defaultTenantUserRole as RoleSchema
  }
});

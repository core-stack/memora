import { z } from "zod";
import { orderSchema } from "./shared";

export const roleScopeEnum = z.enum(["TENANT", "GLOBAL"]);

export const roleSchema = z.object({
  id: z.uuid().optional(),

  key: z.string().min(1),
  name: z.string().min(1),
  permissions: z.number().int().nonnegative(),

  scope: roleScopeEnum.default("TENANT"),

  tenantId: z.uuid().nullable().optional(),
  creatorId: z.uuid().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export const roleFilterSchema = z.object({
  filter: z.object({
    id: z.uuid().optional(),
    key: z.string().optional(),
    name: z.string().optional(),
  }).strict().optional(),
  order: z.object({
    name: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type RoleFilterSchema = z.infer<typeof roleFilterSchema>;
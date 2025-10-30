import { z } from "zod";
import { orderSchema } from "./shared";

export const memberSchema = z.object({
  id: z.uuid(),

  userId: z.uuid(),
  tenantId: z.uuid(),
  roleId: z.uuid().nullable().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MemberSchema = z.infer<typeof memberSchema>;

export const memberFilterSchema = z.object({
  filter: z.object({
    id: z.uuid().optional(),
    userId: z.uuid().optional(),
    tenantId: z.uuid().optional(),
    roleId: z.uuid().optional(),
  }).strict().optional(),
  order: z.object({
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type MemberFilterSchema = z.infer<typeof memberFilterSchema>;

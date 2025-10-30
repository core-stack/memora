import { z } from "zod";
import { orderSchema } from "./shared";

export const userSchema = z.object({
  id: z.uuid(),

  name: z.string().max(255).optional(),
  email: z.email(),
  emailVerified: z.date().optional(),
  image: z.url().nullable().optional(),

  roleId: z.uuid(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const userFilterSchema = z.object({
  filter: z.object({
    id: z.uuid(),
    email: z.string(),
    name: z.string(),
  }).partial().strict().optional(),
  order: z.object({
    name: orderSchema,
    email: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type UserFilterSchema = z.infer<typeof userFilterSchema>;
import { z } from "zod";
import { orderSchema } from "./shared";

export const accountSchema = z.object({
  id: z.uuid().optional(),

  provider: z.string().min(1),
  providerAccountId: z.string().min(1),

  userId: z.uuid(),
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const accountFilterSchema = z.object({
  filter: z.object({
    id: z.uuid().optional(),
    userId: z.uuid().optional(),
    provider: z.string().optional(),
    providerAccountId: z.uuid().optional(),
  }).strict().optional(),
  order: z.object({
    provider: orderSchema,
  }).strict().optional()
}).strict();

export type AccountFilterSchema = z.infer<typeof accountFilterSchema>;
import { createTagSchema as originalCreateTagSchema } from "@memora/schemas";
import z from "zod";

export const createTagSchema = originalCreateTagSchema.extend({
  tenantId: z.string().uuid()
});
export type CreateTag = z.infer<typeof createTagSchema>;
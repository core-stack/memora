import { accountSchema } from "@snipet/schemas";
import z from "zod";

export const accountEntity = accountSchema;
export type AccountEntity = z.infer<typeof accountEntity>;

export const createAccountEntity = accountEntity.omit({ userId: true, id: true }).extend({
  email: z.email(),
  name: z.string().optional(),
  image: z.string().optional(),
  emailVerified: z.boolean().default(false),
})
export type CreateAccountEntity = z.infer<typeof createAccountEntity>;
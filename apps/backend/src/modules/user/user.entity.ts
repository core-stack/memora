import { passwordSchema, userSchema } from "@snipet/schemas";
import z from "zod";

export const userEntitySchema = userSchema.extend({
  password: passwordSchema,
});

export type UserEntity = z.infer<typeof userEntitySchema>;

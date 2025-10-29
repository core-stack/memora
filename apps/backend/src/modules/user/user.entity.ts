import { passwordSchema, userSchema } from "@snipet/schemas";
import z from "zod";

export const userEntitySchema = userSchema.extend({
  password: passwordSchema,
});
export type UserEntity = z.infer<typeof userEntitySchema>;

export const createUserEntity = userEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUserEntity = z.infer<typeof createUserEntity>;

export const updateUserEntity = userEntitySchema.omit({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  password: true,
}).partial();
export type UpdateUserEntity = z.infer<typeof updateUserEntity>;
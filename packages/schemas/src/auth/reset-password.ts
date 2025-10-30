import z from "zod";
import { passwordSchema } from "./password";

export const resetPasswordSchema = z.object({
  token: z.uuid(),
  password: passwordSchema,
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
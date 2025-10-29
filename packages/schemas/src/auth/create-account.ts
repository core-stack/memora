import z from "zod";
import { passwordSchema } from "./password";

export const createAccountSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

import z from "zod";
import { passwordSchema } from "./password";

export const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  redirect: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

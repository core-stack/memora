import z from "zod";

export const forgetPasswordSchema = z.object({ email: z.email() });
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

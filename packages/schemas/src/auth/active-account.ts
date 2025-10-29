import z from "zod";

export const activeAccountSchema = z.object({ token: z.uuid() });
export type ActiveAccountSchema = z.infer<typeof activeAccountSchema>;

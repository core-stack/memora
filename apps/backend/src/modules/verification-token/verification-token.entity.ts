import z from "zod";

export const verificationTokenEnum = z.enum(["RESET_PASSWORD", "ACTIVE_ACCOUNT"]);

export const verificationTokenEntity = z.object({
  type: verificationTokenEnum,
  token: z.uuid(),
  expires: z.date(),
  userId: z.uuid(),
});
export type VerificationTokenEntity = z.infer<typeof verificationTokenEntity>;


export const createVerificationTokenEntity = verificationTokenEntity.omit({ token: true });
export type CreateVerificationTokenEntity = z.infer<typeof createVerificationTokenEntity>;

export const updateVerificationTokenEntity = verificationTokenEntity.omit({ token: true }).partial();
export type UpdateVerificationTokenEntity = z.infer<typeof updateVerificationTokenEntity>;
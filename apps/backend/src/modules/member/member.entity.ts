import { memberSchema, tenantSchema } from "@snipet/schemas";
import z from "zod";

export const memberEntity = memberSchema;
export type MemberEntity = z.infer<typeof memberEntity>;
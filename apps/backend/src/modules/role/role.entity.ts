import { roleSchema } from "@snipet/schemas";
import z from "zod";

export const roleEntity = roleSchema;
export type RoleEntity = z.infer<typeof roleEntity>;
import { createTagSchema, tagSchema, updateTagSchema } from "@snipet/schemas";
import z from "zod";

export const tagEntity = tagSchema;
export type TagEntity = z.infer<typeof tagEntity>;

export const createTagEntity = createTagSchema;
export type CreateTagEntity = z.infer<typeof createTagEntity>;

export const updateTagEntity = updateTagSchema;
export type UpdateTagEntity = z.infer<typeof updateTagEntity>;
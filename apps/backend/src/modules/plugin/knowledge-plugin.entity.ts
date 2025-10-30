import { knowledgePluginSchema } from "@snipet/schemas";
import z from "zod";

export const knowledgePluginEntity = knowledgePluginSchema;
export type KnowledgePluginEntity = z.infer<typeof knowledgePluginEntity>;
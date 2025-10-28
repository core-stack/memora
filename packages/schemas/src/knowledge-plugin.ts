import z from "zod";

export const knowledgePluginSchema = z.object({
  knowledgeId: z.uuid(),
  pluginId: z.uuid()
});
export type KnowledgePlugin = z.infer<typeof knowledgePluginSchema>;

export const knowledgePluginFilterSchema = knowledgePluginSchema.extend({
  filter: z.object({
    knowledgeId: z.uuid(),
    pluginId: z.uuid()
  }).strict().optional()
}).strict();
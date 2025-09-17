import z from "zod";

export const knowledgePluginSchema = z.object({
  knowledgeId: z.string().uuid(),
  pluginId: z.string().uuid()
});
export type KnowledgePlugin = z.infer<typeof knowledgePluginSchema>;

export const knowledgePluginFilterSchema = knowledgePluginSchema.extend({
  filter: z.object({
    knowledgeId: z.string().uuid(),
    pluginId: z.string().uuid()
  }).strict().optional()
}).strict();
import z from "zod";

import { orderSchema } from "./shared";

export const pluginSchema = z.object({
  id: z.string().uuid(),

  name: z.string().max(50).nullable(),
  description: z.string().nullable(),
  whenUse: z.string().nullable(),
  type: z.string().max(255),
  config: z.unknown(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Plugin = z.infer<typeof pluginSchema>;

export const pluginFilterSchema = pluginSchema.extend({
  filter: z.object({
    id: z.string().uuid().optional(),
    name: z.string().optional(),
  }).strict().optional(),
  order: z.object({
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();

export type PluginFilter = z.infer<typeof pluginFilterSchema>;

export const createPluginSchema = pluginSchema.pick({ name: true, type: true, config: true });
export type CreatePlugin = z.infer<typeof createPluginSchema>;

export const updatePluginSchema = pluginSchema.pick({ id: true, name: true, type: true, config: true });
export type UpdatePlugin = z.infer<typeof updatePluginSchema>;

export const pluginDefinitionSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(255),
  icon: z.string().max(255),
  configSchema: z.record(
    z.string(),
    z.enum(["string", "number", "boolean", "secret-string", "secret-number", "secret-boolean"])
  ),
})
export const listPluginsSchema = z.array(pluginDefinitionSchema);
export type ListPlugins = z.infer<typeof listPluginsSchema>;
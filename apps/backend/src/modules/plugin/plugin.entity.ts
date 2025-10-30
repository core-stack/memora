import { createPluginSchema, pluginSchema, updatePluginSchema } from "@snipet/schemas";
import z from "zod";

export const pluginEntity = pluginSchema;
export type PluginEntity = z.infer<typeof pluginEntity>;

export const createPluginEntity = createPluginSchema;
export type CreatePluginEntity = z.infer<typeof createPluginEntity>;


export const updatePluginEntity = updatePluginSchema;
export type UpdatePluginEntity = z.infer<typeof updatePluginEntity>;

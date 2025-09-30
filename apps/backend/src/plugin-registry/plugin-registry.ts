import { z } from 'zod';

import { pluginRegistrySchema } from '@memora/schemas';

export const inputSchema: z.ZodType<IInputSchema> = z.lazy((): z.ZodType<IInputSchema> => z.object({
  type: z.enum(["string", "number", "boolean", "object", "array"]),
  required: z.boolean(),
  description: z.string(),
  child: z.array(inputSchema).or(inputSchema).optional()
})).superRefine((data, ctx) => {
  if ((data.type === "object" || data.type === "array") && !data.child) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Input child is required when type is object or array",
    });
  }
});

export type IInputSchema = {
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description: string;
  child?: IInputSchema[] | IInputSchema | Record<string, IInputSchema>;
}


export const pluginRegistryWithInputSchema = pluginRegistrySchema.extend({
  inputSchema: z.record(z.string(), inputSchema)
});
export type PluginRegistryWithInput = z.infer<typeof pluginRegistryWithInputSchema>;
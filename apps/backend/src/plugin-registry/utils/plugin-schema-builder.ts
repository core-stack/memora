import z, { ZodTypeAny } from "zod";

import { IInputSchema } from "../plugin-registry";

const buildZodFromSchema = (def: IInputSchema): ZodTypeAny => {
  let base: ZodTypeAny;

  switch (def.type) {
    case "string":
      base = z.string();
      break;
    case "number":
      base = z.number();
      break;
    case "boolean":
      base = z.boolean();
      break;
    case "object":
      if (!def.child || Array.isArray(def.child)) {
        throw new Error("Object type requires child as Record<string, IInputSchema>");
      }
      base = buildInputObjectSchema(def.child as Record<string, IInputSchema>);
      break;
    case "array":
      if (!def.child || Array.isArray(def.child)) {
        throw new Error("Array type requires child as IInputSchema");
      }
      base = z.array(buildZodFromSchema(def.child as IInputSchema));
      break;
    default:
      throw new Error(`Unsupported type: ${def.type}`);
  }

  return def.required ? base : base.optional();
}

export const buildInputObjectSchema = (defs: Record<string, IInputSchema>) => {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [key, schema] of Object.entries(defs)) {
    shape[key] = buildZodFromSchema(schema);
  }
  return z.object(shape);
}
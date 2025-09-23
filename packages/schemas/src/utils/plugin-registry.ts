import z, { ZodTypeAny } from 'zod';

import { IConfigSchema } from '../plugin-registry';

const buildZodFromSchema = (def: IConfigSchema): ZodTypeAny => {
  let base: ZodTypeAny;

  switch (def.type) {
    case "string":
    case "secret-string":
      base = z.string();
      break;
    case "number":
    case "secret-number":
      base = z.coerce.number();
      break;
    case "boolean":
      base = z.boolean();
      break;
    default:
      throw new Error(`Unsupported type: ${def.type}`);
  }

  return def.required ? base : base.optional();
}

export const buildConfigObjectSchema = (defs: Record<string, IConfigSchema>) => {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [key, schema] of Object.entries(defs)) {
    shape[key] = buildZodFromSchema(schema);
  }
  return z.object(shape);
}
import { Query } from "@nestjs/common";
import z from "zod";

import { QueryTransformerPipe } from "../pipes/query-transformer.pipe";
import { ZodValidationPipe } from "../pipes/zod.pipe";

export const ZodQuery = (schemaOrField: z.ZodType | string, schema?: z.ZodType) => {
  if (typeof schemaOrField === 'string') {
    return Query(schemaOrField, new QueryTransformerPipe(), new ZodValidationPipe(schema ?? z.string()))
  }
  return Query(new QueryTransformerPipe(), new ZodValidationPipe(schemaOrField))
}
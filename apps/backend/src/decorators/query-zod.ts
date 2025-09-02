import { Query } from "@nestjs/common";
import z from "zod";

import { ZodValidationPipe } from "src/pipes/zod.pipe";

export const QueryZod = (schema: z.ZodType) => {
  return Query(new ZodValidationPipe(schema))
}
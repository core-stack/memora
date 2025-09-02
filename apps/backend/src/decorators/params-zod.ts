import { Param } from "@nestjs/common";
import z from "zod";

import { ZodValidationPipe } from "src/pipes/zod.pipe";

export const ParamZod = (schema: z.ZodType) => {
  return Param(new ZodValidationPipe(schema))
}
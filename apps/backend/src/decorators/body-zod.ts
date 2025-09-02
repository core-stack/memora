import { Body } from "@nestjs/common";
import z from "zod";

import { ZodValidationPipe } from "src/pipes/zod.pipe";

export const BodyZod = (schema: z.ZodType) => {
  return Body(new ZodValidationPipe(schema))
}
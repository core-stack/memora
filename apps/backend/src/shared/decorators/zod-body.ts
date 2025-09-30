import z from 'zod';

import { Body } from '@nestjs/common';

import { ZodValidationPipe } from '../pipes/zod.pipe';

export const ZodBody = (schemaOrField: z.ZodType | string, schema?: z.ZodType) => {
  if (typeof schemaOrField === 'string') {
    return Body(schemaOrField, new ZodValidationPipe(schema ?? z.string()))
  }
  return Body(new ZodValidationPipe(schemaOrField))
}
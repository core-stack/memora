import z from 'zod';

import { Param } from '@nestjs/common';

import { ZodValidationPipe } from '../pipes/zod.pipe';

export const ZodParam = (schemaOrField: z.ZodType | string, schema?: z.ZodType) => {
  if (typeof schemaOrField === 'string') {
    return Param(schemaOrField, new ZodValidationPipe(schema ?? z.string()))
  }
  return Param(new ZodValidationPipe(schemaOrField))
}
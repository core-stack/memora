import z from 'zod';

import { Query } from '@nestjs/common';

import { ZodValidationPipe } from '../pipes/zod.pipe';

export const ZodQuery = (schemaOrField: z.ZodType | string, schema?: z.ZodType) => {
  if (typeof schemaOrField === 'string') {
    return Query(schemaOrField, new ZodValidationPipe(schema ?? z.string()))
  }
  return Query(new ZodValidationPipe(schemaOrField))
}
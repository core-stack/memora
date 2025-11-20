import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FieldOptions } from '../types';

export const buildApiProperty = (opts: FieldOptions): PropertyDecorator => {
  const isRequired = opts.required ?? true;

  const baseConfig: Record<string, any> = {
    description: opts.description,
    example: opts.example,
    default: opts.default,
    isArray: opts.isArray,
  };

  switch (opts.type) {
    case "string":
      baseConfig.type = String;
      let format: string | undefined;
      if (opts.uuid) format = 'uuid';
      if (opts.url) format = 'uri';
      if (opts.password) format = 'password';
      if (opts.email) format = 'email';
      if (format) baseConfig.format = format;
      break;
    case "number":
      baseConfig.type = Number;
      break;
    case "boolean":
      baseConfig.type = Boolean;
      break;
    case "date":
      baseConfig.type = Date;
      break;
    case "enum":
      const enumValues = typeof opts.enum === "function" ? opts.enum() : opts.enum;
      baseConfig.enum = enumValues;
      break;
  }
  if (opts.debug) console.log(baseConfig);
  return isRequired ? ApiProperty(baseConfig) : ApiPropertyOptional(baseConfig);
};

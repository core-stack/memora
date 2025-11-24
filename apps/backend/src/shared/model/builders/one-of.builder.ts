import { ValidateNested } from "class-validator";

import {
  ApiExtraModels, ApiProperty, ApiPropertyOptional, ApiPropertyOptions, getSchemaPath
} from "@nestjs/swagger";

import { FieldOneOfOptions } from "../types";

export const buildOneOfDecorators = (opts: FieldOneOfOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  const isRequired = opts.required ?? true;

  // RESOLVE os modelos (executa as funções)
  const resolved = opts.classes.map(fn => fn());

  const apiMetadata: ApiPropertyOptions = {
    required: isRequired,
    description: opts.description,
    example: opts.example,
    default: opts.default,
    isArray: opts.isArray,
    oneOf: resolved.map(model => ({
      $ref: getSchemaPath(model)
    }))
  };

  // Register each model in Swagger
  resolved.forEach(model => {
    decorators.push(ApiExtraModels(model));
  });

  // Add ApiProperty
  decorators.push(
    isRequired ? ApiProperty(apiMetadata) : ApiPropertyOptional(apiMetadata)
  );

  // Add validation
  decorators.push(ValidateNested({ each: opts.isArray }));

  return decorators;
};

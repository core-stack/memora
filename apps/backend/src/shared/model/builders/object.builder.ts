import { ValidateNested } from "class-validator";

import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from "@nestjs/swagger";

import { FieldObjectOptions } from "../types";

export const buildObjectDecorators = (opts: FieldObjectOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  const isRequired = opts.required ?? true;

  const apiMetadata: ApiPropertyOptions = {
    required: isRequired,
    description: opts.description,
    example: opts.example,
    default: opts.default,
    isArray: opts.isArray,
    additionalProperties: opts.additionalProperties
  };

  if (opts.debug) console.log(apiMetadata);
  decorators.push(isRequired ? ApiProperty(apiMetadata) : ApiPropertyOptional(apiMetadata));
  if (opts.debug) console.log("added api property");

  decorators.push(ValidateNested({ each: opts.isArray }));
  if (opts.debug) console.log("added validate nested");
  return decorators;
};

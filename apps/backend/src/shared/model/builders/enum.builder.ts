import { IsEnum } from "class-validator";

import { FieldEnumOptions } from "../types";
import { buildApiProperty } from "./api-property";

export const buildEnumDecorators = (opts: FieldEnumOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  const enumValues = typeof opts.enum === "function" ? opts.enum() : opts.enum;

  decorators.push(buildApiProperty(opts));

  decorators.push(IsEnum(enumValues as any));
  if (opts.debug) console.log("added enum validator", enumValues);
  return decorators;
};

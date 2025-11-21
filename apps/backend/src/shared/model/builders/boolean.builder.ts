import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";

import { FieldBooleanOptions } from "../types";
import { buildApiProperty } from "./api-property";

export const buildBooleanDecorators = (opts: FieldBooleanOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  // Swagger
  decorators.push(buildApiProperty(opts));

  // TRANSFORM: convert "true"/"false"/1/0/etc in boolean
  decorators.push(
    Transform(({ value }) => {
      if (typeof value === "boolean") return value;
      if (value === "true" || value === "1") return true;
      if (value === "false" || value === "0") return false;
      return Boolean(value);
    })
  );
  if (opts.debug) console.log("added boolean transformer");
  // VALIDATION
  decorators.push(IsBoolean());
  if (opts.debug) console.log("added boolean validator");

  return decorators;
};

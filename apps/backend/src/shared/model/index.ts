import { Exclude } from "class-transformer";

import { applyDecorators } from "@nestjs/common";

import { builder } from "./builders";
import { FieldOptions } from "./types";

export const Field = (opts: FieldOptions) => {
  const decorators = builder[opts.type](opts as any);
  if (opts.hidden) decorators.push(Exclude());
  return applyDecorators(...decorators);
};

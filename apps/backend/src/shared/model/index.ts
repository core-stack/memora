import { applyDecorators } from "@nestjs/common";

import { builder } from "./builders";
import { FieldOptions } from "./types";

export const Field = (opts: FieldOptions) => {
  const decorators = builder[opts.type](opts as any);
  return applyDecorators(...decorators);
};

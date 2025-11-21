import { Transform } from "class-transformer";
import { IsInt, IsNegative, IsNumber, IsPositive, Max, Min } from "class-validator";

import { FieldNumberOptions } from "../types";
import { buildApiProperty } from "./api-property";

export const buildNumberDecorators = (opts: FieldNumberOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  decorators.push(buildApiProperty(opts));

  decorators.push(Transform(({ value }) => Number(value)));
  if (opts.debug) console.log("added number transformer");

  decorators.push(IsNumber());
  if (opts.debug) console.log("added number validator");

  if (opts.min) {
    if (typeof opts.min === "object") decorators.push(Min(opts.min.min, opts.min as any));
    else decorators.push(Min(opts.min));
    if (opts.debug) console.log("added min validator");
  }

  if (opts.max) {
    if (typeof opts.max === "object") decorators.push(Max(opts.max.max, opts.max as any));
    else decorators.push(Max(opts.max));
    if (opts.debug) console.log("added max validator");
  }

  if (opts.integer) decorators.push(IsInt());
  if (opts.integer && opts.debug) console.log("added integer validator");
  if (opts.positive) decorators.push(IsPositive());
  if (opts.positive && opts.debug) console.log("added positive validator");
  if (opts.negative) decorators.push(IsNegative());
  if (opts.negative && opts.debug) console.log("added negative validator");

  return decorators;
};

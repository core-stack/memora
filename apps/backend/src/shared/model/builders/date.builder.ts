import { Transform } from "class-transformer";
import { IsDate, MaxDate, MinDate } from "class-validator";
import moment from "moment";

import { FieldDateOptions } from "../types";
import { buildApiProperty } from "./api-property";

export const buildDateDecorators = (opts: FieldDateOptions): PropertyDecorator[] => {
  const decorators: PropertyDecorator[] = [];

  // Swagger
  decorators.push(buildApiProperty(opts));

  // TRANSFORM: allow transforming string to Date
  decorators.push(
    Transform(({ value }) => {
      if (value instanceof Date) return value;
      if (!value) return value;
      return moment(value).toDate();
    })
  );
  if (opts.debug) console.log("added date transformer");

  // VALIDATION
  decorators.push(IsDate());

  if (opts.minDate) {
    decorators.push(MinDate(new Date(opts.minDate)));
    if (opts.debug) console.log("added min date validator");
  }

  if (opts.maxDate) {
    decorators.push(MaxDate(new Date(opts.maxDate)));
    if (opts.debug) console.log("added max date validator");
  }

  return decorators;
};

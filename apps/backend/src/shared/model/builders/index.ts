import { buildBooleanDecorators } from "./boolean.builder";
import { buildClassDecorators } from "./class.builder";
import { buildDateDecorators } from "./date.builder";
import { buildEnumDecorators } from "./enum.builder";
import { buildNumberDecorators } from "./number.builder";
import { buildObjectDecorators } from "./object.builder";
import { buildOneOfDecorators } from "./one-of.builder";
import { buildStringDecorators } from "./string.builder";

export const builder = {
  string: buildStringDecorators,
  number: buildNumberDecorators,
  enum: buildEnumDecorators,
  boolean: buildBooleanDecorators,
  date: buildDateDecorators,
  class: buildClassDecorators,
  oneOf: buildOneOfDecorators,
  object: buildObjectDecorators
};

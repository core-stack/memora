import { TransformOptions } from "class-transformer";
import { ValidationOptions } from "class-validator";
import * as ValidatorJS from "validator";

import { Constructor } from "@/types/constructor";

export type EnumAllowedTypes =
  | any[]
  | Record<string, any>
  | (() => any[] | Record<string, any>);

export type BaseFieldOptions = {
  required?: boolean;
  isArray?: boolean;
  description?: string;
  example?: any;
  default?: any;

  transform?: (value: any) => any;

  debug?: boolean;
};

export type FieldStringOptions = BaseFieldOptions & {
  type: "string";
  min?: number | { length: number } & ValidationOptions;
  max?: number | { length: number } & ValidationOptions;
  length?: number | { length: number } & ValidationOptions;
  lowercase?: boolean | TransformOptions;
  uppercase?: boolean | TransformOptions;
  trim?: boolean | TransformOptions;
  email?: boolean | { emailOptions?: ValidatorJS.IsEmailOptions } & ValidationOptions;
  regex?: string | { match: RegExp } & ValidationOptions;
  uuid?: boolean;
  password?: boolean;
  url?: boolean | ValidatorJS.IsURLOptions;
};

export type FieldNumberOptions = BaseFieldOptions & {
  type: "number";
  min?: number | { min: number } & ValidationOptions;
  max?: number | { max: number } & ValidationOptions;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
};

export type FieldEnumOptions = BaseFieldOptions & {
  type: "enum";
  enum: EnumAllowedTypes;
};

export type FieldBooleanOptions = BaseFieldOptions & {
  type: "boolean";
};

export type FieldDateOptions = BaseFieldOptions & {
  type: "date";
  minDate?: Date | string;
  maxDate?: Date | string;
};

export type FieldClassOptions<T = any> = BaseFieldOptions & {
  type: "class";
  class: () => Constructor<T>
};


export type FieldOptions =
  | FieldStringOptions
  | FieldNumberOptions
  | FieldEnumOptions
  | FieldBooleanOptions
  | FieldDateOptions
  | FieldClassOptions

import { toNestErrors, validateFieldsNatively } from '@hookform/resolvers';
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverError,
} from 'react-hook-form';
import { appendErrors } from 'react-hook-form';
import * as z from 'zod';

const isZod4Error = (error: Error): error is z.ZodError => {
  // instanceof is safe in Zod 4 (uses Symbol.hasInstance)
  return error instanceof z.ZodError;
};
const isZod4Schema = (schema: object): schema is z.ZodType => {
  return '_zod' in schema && typeof schema._zod === 'object';
};


function parseZod4Issues(
  zodErrors: z.core.$ZodIssue[],
  validateAllFieldCriteria: boolean,
) {
  const errors: Record<string, FieldError> = {};
  // const _zodErrors = zodErrors as z4.$ZodISsue; //
  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const { code, message, path } = error;
    const _path = path.join('.');

    if (!errors[_path]) {
      if (error.code === 'invalid_union' && error.errors.length > 0) {
        const unionError = error.errors[0][0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        };
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if (error.code === 'invalid_union') {
      error.errors.forEach((unionError) =>
        unionError.forEach((e) => zodErrors.push(e)),
      );
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as string[], error.message)
          : error.message,
      ) as FieldError;
    }

    zodErrors.shift();
  }

  return errors;
}

type RawResolverOptions = {
  mode?: 'async' | 'sync';
  raw: true;
};
type NonRawResolverOptions = {
  mode?: 'async' | 'sync';
  raw?: false;
};


type FallbackIssue = {
  code: string;
  message: string;
  path: (string | number)[];
};
type Zod4ParseParams = {
  readonly error?: (
    iss: FallbackIssue,
  ) => null | undefined | string | { message: string };
  readonly reportInput?: boolean;
  readonly jitless?: boolean;
};

export function zodResolver<
  Input extends FieldValues,
  Context,
  Output,
  T extends z.ZodType<Output, Input> = z.ZodType<Output, Input>,
>(
  schema: T,
  schemaOptions?: Zod4ParseParams,
  resolverOptions?: NonRawResolverOptions,
): Resolver<z.input<T>, Context, z.output<T>>;
export function zodResolver<
  Input extends FieldValues,
  Context,
  Output,
  T extends z.ZodType<Output, Input> = z.ZodType<Output, Input>,
>(
  schema: z.ZodType<Output, Input>,
  schemaOptions: Zod4ParseParams | undefined,
  resolverOptions: RawResolverOptions,
): Resolver<z.input<T>, Context, z.input<T>>;
/**
 * Creates a resolver function for react-hook-form that validates form data using a Zod schema
 * @param {z.ZodSchema<Input>} schema - The Zod schema used to validate the form data
 * @param {Partial<z.ParseParams>} [schemaOptions] - Optional configuration options for Zod parsing
 * @param {Object} [resolverOptions] - Optional resolver-specific configuration
 * @param {('async'|'sync')} [resolverOptions.mode='async'] - Validation mode. Use 'sync' for synchronous validation
 * @param {boolean} [resolverOptions.raw=false] - If true, returns the raw form values instead of the parsed data
 * @returns {Resolver<z.output<typeof schema>>} A resolver function compatible with react-hook-form
 * @throws {Error} Throws if validation fails with a non-Zod error
 * @example
 * const schema = z.object({
 *   name: z.string().min(2),
 *   age: z.number().min(18)
 * });
 *
 * useForm({
 *   resolver: zodResolver(schema)
 * });
 */
export function zodResolver<Input extends FieldValues, Context, Output>(
  schema: object,
  schemaOptions?: object,
  resolverOptions: {
    mode?: 'async' | 'sync';
    raw?: boolean;
  } = {},
): Resolver<Input, Context, Output | Input> {
  if (isZod4Schema(schema)) {
    return async (
      values,
      _,
      options
    ): Promise<
      | {
          values: Output | Input;
          errors: {};
        }
      | {
          values: {};
          errors: FieldErrors<Input>;
        }
    > => {
      try {
        const parseFn =
          resolverOptions.mode === 'sync'
            ? (schema.parse as (data: unknown, params?: unknown) => Output)
            : (schema.parseAsync as (
                data: unknown,
                params?: unknown
              ) => Promise<Output>);

        const data = (await parseFn(values, schemaOptions)) as Output;

        if (options.shouldUseNativeValidation)
          validateFieldsNatively({}, options);

        return {
          values: resolverOptions.raw ? { ...values } : data,
          errors: {},
        } satisfies { values: Output | Input; errors: {} };
      } catch (error) {
        if (isZod4Error(error as z.ZodError)) {
          return {
            values: {},
            errors: toNestErrors(
              parseZod4Issues(
                (error as z.ZodError).issues,
                !options.shouldUseNativeValidation &&
                  options.criteriaMode === 'all'
              ),
              options
            ),
          } satisfies { values: {}; errors: FieldErrors<Input> };
        }

        throw error;
      }
    };
  }

  throw new Error('Invalid input: not a Zod schema');
}

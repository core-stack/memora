type DefaultError = {
  message: string;
  statusCode: number;
}

type ApiErrorOptions<T = DefaultError> = {
  message?: string;
  statusCode?: number;
  body?: T;
  errors?: Record<string, string[] | string>;
}
export class ApiError<T = DefaultError> extends Error {
  errors?: Record<string, string[] | string>;
  statusCode?: number;
  body?: T;

  constructor({ errors, message, statusCode, body }: ApiErrorOptions<T>) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
    this.statusCode = statusCode;
    this.body = body;
  }
}

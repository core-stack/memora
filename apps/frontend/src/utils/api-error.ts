type ApiErrorOptions = {
  message?: string;
  statusCode?: number;
  errors?: Record<string, string[] | string>;
}
export class ApiError extends Error {
  errors?: Record<string, string[] | string>;
  statusCode?: number;

  constructor({ errors, message, statusCode }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

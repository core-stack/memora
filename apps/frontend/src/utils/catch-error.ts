import type { ApiError } from "./api-error";

export type NoError<T = any> = [T, null];
export type WithError<E extends Error = ApiError> = [null, E];

export const catchError = async <T = any, E extends Error = ApiError>(promise: Promise<T>): Promise<NoError<T> | WithError<E>> => {
  try {
    return [await promise, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
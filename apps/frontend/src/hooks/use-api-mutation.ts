import { ApiError } from '@/utils/api-error';
import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { useMutation } from '@tanstack/react-query';

import { useParams } from './use-params';
import { useSearchParams } from './use-search-params';

import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { ApiRoutes } from '@/types/api';

export type MutationVariables<TPath extends keyof ApiRoutes, TMethod extends keyof ApiRoutes[TPath]> = {
  body?: ApiRoutes[TPath][TMethod] extends { body: unknown }
    ? ApiRoutes[TPath][TMethod]["body"]
    : never;
  params?: ApiRoutes[TPath][TMethod] extends { params: unknown }
    ? ApiRoutes[TPath][TMethod]["params"]
    : never;
  query?: ApiRoutes[TPath][TMethod] extends { query: unknown }
    ? ApiRoutes[TPath][TMethod]["query"]
    : never;
};

type ResponseMutation<TPath extends keyof ApiRoutes, TMethod extends keyof ApiRoutes[TPath]> = 
  ApiRoutes[TPath][TMethod] extends { response: unknown }
    ? ApiRoutes[TPath][TMethod]["response"]
    : unknown;
  
type ApiMutationOpts<
  TPath extends keyof ApiRoutes = keyof ApiRoutes,
  TMethod extends keyof ApiRoutes[TPath] = keyof ApiRoutes[TPath],
  TData extends ResponseMutation<TPath, TMethod> = ResponseMutation<TPath, TMethod>,
  TError extends ApiError = ApiError,
  TVariables extends MutationVariables<TPath, TMethod> = MutationVariables<TPath, TMethod>,
  TContext = unknown> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>, "mutationKey" | "mutationFn"> &
  {
    passParams?: boolean;
    passQuery?: boolean;
    method: TMethod;
  };

export function useApiMutation<
  TPath extends keyof ApiRoutes,
  TMethod extends keyof ApiRoutes[TPath],
  TData = ApiRoutes[TPath][TMethod] extends { response: unknown }
    ? ApiRoutes[TPath][TMethod]["response"]
    : unknown,
  TError extends Error = ApiError,
  TContext = unknown
>(
  key: TPath,
  options: ApiMutationOpts<TPath, TMethod, TData, TError, MutationVariables<TPath, TMethod>, TContext> = 
  { passParams: true, passQuery: true, method: "POST" as TMethod }
): UseMutationResult<TData, TError, MutationVariables<TPath, TMethod>, TContext> {
  const routeParams = useParams();
  const [routeSearchParams] = useSearchParams();

  return useMutation<TData, TError, MutationVariables<TPath, TMethod>, TContext>({
    mutationFn: async ({ body, params: p, query: q }: MutationVariables<TPath, TMethod>): Promise<TData> => {
      if (options.passParams === undefined) options.passParams = true;
      if (options.passQuery === undefined) options.passQuery = true;
      
      const params = p ?? (options.passParams ? routeParams : {});
      
      const searchParams: Record<string, string> = {};
      for (const [key, value] of routeSearchParams.entries()) {
        searchParams[key] = value;
      }
      const query = q ?? (options.passQuery ? searchParams : {});            
      const url = buildUrl(key, params, query);

      const res = await fetch(url, {
        method: options.method as string,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body ?? {}),
      });

      const [json, err] = await catchError<TData, TError>(res.json());
      if (err !== null) throw err;
      if (!res.ok) throw json;
      if (!json) throw new ApiError({ message: "Error fetching data" });

      return json;
    },
    mutationKey: [key],
    ...options,
  });
}

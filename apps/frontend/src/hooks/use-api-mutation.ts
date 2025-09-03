
import { useParams, useSearchParams } from 'react-router';

import { ApiError } from '@/utils/api-error';
import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { useMutation } from '@tanstack/react-query';

import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

type MutationVariables = {
  body?: any;
  params?: Record<string, any>;
  query?: Record<string, any>;
};

type ApiMutationOpts<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>, "mutationKey" | "mutationFn"> &
  {
    passParams?: boolean;
    passQuery?: boolean;
    method?: string;
  };

export function useApiMutation<
  TData = unknown,
  TError extends Error = ApiError,
  TVariables extends MutationVariables = MutationVariables,
  TContext = unknown
>(
  key: string,
  options: ApiMutationOpts<TData, TError, Partial<TVariables>, TContext> = { passParams: true, passQuery: true, method: "POST" }
): UseMutationResult<TData, TError, Partial<TVariables>, TContext> {
  const routeParams = useParams();
  const [routeSearchParams] = useSearchParams();

  return useMutation<TData, TError, Partial<TVariables>, TContext>({
    mutationFn: async ({ body, params: p, query: q }: Partial<TVariables>): Promise<TData> => {
      const params = p ?? (options.passParams ? routeParams : {});
      const searchParams: Record<string, string> = {};
      for (const [key, value] of routeSearchParams.entries()) {
        searchParams[key] = value;
      }
      const query = q ?? (options.passQuery ? searchParams : {});      
      const url = buildUrl(key, params, query);

      const res = await fetch(url, {
        method: options.method,
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

import { useParams, useSearchParams } from 'react-router';

import { ApiError } from '@/utils/api-error';
import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { useQuery } from '@tanstack/react-query';

import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
type ApiQueryOpts<TBody> = {
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: TBody;
  enabled?: boolean;
  passParams?: boolean;
  passQuery?: boolean;
  method?: string;
};

export function useApiQuery<
  TQueryFnData = unknown,
  TError extends Error = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TBody = undefined
>(
  path: string,
  opts: ApiQueryOpts<TBody> & 
    Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn"> = { passParams: true, passQuery: true }
): UseQueryResult<TData, TError> {
  const method = opts.method ?? "GET";
  const routeParams = useParams();
  const [routeSearchParams] = useSearchParams();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...opts,
    queryKey: [path, opts?.params, opts?.query, opts?.body] as unknown as TQueryKey,
    enabled: opts?.enabled,
    queryFn: async (): Promise<TQueryFnData> => {
      const params = opts?.params ?? (opts.passParams ? routeParams : {});

      const searchParams: Record<string, string> = {};
      for (const [key, value] of routeSearchParams.entries()) {
        searchParams[key] = value;
      }
      const query = opts?.query ?? (opts.passQuery ? searchParams : {});   
     
      const url = buildUrl(path, params, query);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...((method as string) !== "GET" && {
          body: JSON.stringify(opts?.body ?? {}),
        }),
      });

      const [json, err] = await catchError<TQueryFnData, TError>(res.json());
      if (err !== null) throw err;
      if (!res.ok) throw json;
      if (!json) throw new ApiError({ message: "Error fetching data" });

      return json;
    },
  });
}

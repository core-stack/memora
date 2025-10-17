import { ApiError } from '@/utils/api-error';
import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useParams } from './use-params';
import { useSearchParams } from './use-search-params';

import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ApiRoutes } from '@/types/api';

type ApiQueryOpts<TPath extends keyof ApiRoutes, TMethod extends keyof ApiRoutes[TPath]> = {
  params?: ApiRoutes[TPath][TMethod] extends { params: unknown }
    ? Partial<ApiRoutes[TPath][TMethod]["params"]>
    : never;
  query?: ApiRoutes[TPath][TMethod] extends { query: unknown }
    ? Partial<ApiRoutes[TPath][TMethod]["query"]>
    : never;
  body?: ApiRoutes[TPath][TMethod] extends { body: unknown }
    ? ApiRoutes[TPath][TMethod]["body"]
    : never;
  enabled?: boolean;
  method: TMethod;
  passParams?: boolean;
  passQuery?: boolean;
};


export function useApiQuery<
  TPath extends keyof ApiRoutes,
  TMethod extends keyof ApiRoutes[TPath] = keyof ApiRoutes[TPath],
  TError extends Error = ApiError,
  TData = ApiRoutes[TPath][TMethod] extends { response: unknown }
    ? ApiRoutes[TPath][TMethod]["response"]
    : unknown,
  TQueryKey extends QueryKey = QueryKey
>(
  path: TPath,
  opts: ApiQueryOpts<TPath, TMethod> &
    Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
    = { passParams: true, passQuery: true, method: 'GET' as TMethod }
): UseQueryResult<TData, TError> & { optimisticUpdate: (merge: (oldValue: TData) => TData) => void } {
  const method = (opts?.method ?? "GET") as keyof ApiRoutes[TPath];
  const routeParams = useParams();
  const [routeSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const optimisticUpdate = (merge: (oldValue: TData) => TData) => {
    const key = [path, opts?.params, opts?.query, routeParams] as unknown as TQueryKey;
    const prevData = queryClient.getQueryData<TData, TQueryKey>(key)
    queryClient.setQueryData<TData>(key, merge(prevData as TData));
  }


  return { 
    ...useQuery<TData, TError, TData, TQueryKey>({
      ...opts,
      queryKey: [path, opts?.params, opts?.query, routeParams] as unknown as TQueryKey,
      enabled: opts?.enabled,
      queryFn: async (): Promise<TData> => {
        if (opts.passParams === undefined) opts.passParams = true;
        if (opts.passQuery === undefined) opts.passQuery = true;
        
        const params = { ...(opts.passParams ? routeParams : {}), ...opts?.params };
        const query = { ...(opts.passQuery ? Object.fromEntries(routeSearchParams.entries()) : {}), ...opts?.query };
        
        const url = buildUrl(path, params, query);
        const res = await fetch(url, {
          method: method as string,
          headers: {
            "Content-Type": "application/json",
          },
          ...((method as string) !== "GET" && {
            body: JSON.stringify(opts?.body ?? {}),
          }),
        });

        const [json, err] = await catchError<TData, TError>(res.json());
        if (err !== null) throw err;
        if (!res.ok) throw json;
        if (!json) throw new ApiError({ message: "Error fetching data" });

        return json;
      },
    }),
    optimisticUpdate
  };
}

import { useQueryClient } from '@tanstack/react-query';

import type { ApiRoutes } from "@/types/api";

type ApiInvalidateOpts<TPath extends keyof ApiRoutes, TMethod extends keyof ApiRoutes[TPath]> = {
  params?: ApiRoutes[TPath][TMethod] extends { params: unknown }
    ? Partial<ApiRoutes[TPath][TMethod]["params"]>
    : never;
  query?: ApiRoutes[TPath][TMethod] extends { query: unknown }
    ? Partial<ApiRoutes[TPath][TMethod]["query"]>
    : never;
}
export const useApiInvalidate = () => {
  const queryClient = useQueryClient();

  return <TPath extends keyof ApiRoutes, TMethod extends keyof ApiRoutes[TPath] = keyof ApiRoutes[TPath]>(path: TPath, opts?: ApiInvalidateOpts<TPath, TMethod>) =>
    queryClient.invalidateQueries({ 
      queryKey: opts ? [path, opts.params, opts.query] : [path],
      predicate: (q) => q.queryKey[0] === path && !opts
    });
};

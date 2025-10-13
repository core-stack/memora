import { useRef } from 'react';

import { ApiError } from '@/utils/api-error';
import { buildUrl } from '@/utils/build-url';
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
    onToken?: (token: string) => void;
    onDone?: () => void;
    transform?: (data: string) => TData;
  };

export function useApiStream<
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
): UseMutationResult<TData, TError, MutationVariables<TPath, TMethod>, TContext> & { stop: () => void | undefined } {
  const abortRef = useRef<AbortController | null>(null);
  const routeParams = useParams();
  const [routeSearchParams] = useSearchParams();

  const mutation = useMutation({
    mutationFn: async ({ body, params: p, query: q }: MutationVariables<TPath, TMethod>) => {
      if (options.passParams === undefined) options.passParams = true;
      if (options.passQuery === undefined) options.passQuery = true;
      
      const params = p ?? (options.passParams ? routeParams : {});
      
      const searchParams: Record<string, string> = {};
      for (const [key, value] of routeSearchParams.entries()) {
        searchParams[key] = value;
      }
      const query = q ?? (options.passQuery ? searchParams : {});            
      const url = buildUrl(key, params, query);

      abortRef.current = new AbortController();
      const response = await fetch(url, {
        method: options.method as string,
        headers: { "Content-Type": "application/json" },
        body: options.method === "GET" ? undefined : JSON.stringify(body ?? {}),
        signal: abortRef.current.signal,
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              return fullText;
            }

            try {
              const json = JSON.parse(data);
              const token = json.token;
              fullText += token;
              options.onToken?.(token);
            } catch {
              // ignora linhas quebradas
            }
          }
        }
      }
      options.onDone?.();
      return (options.transform ? options.transform(fullText) : (fullText as unknown as TData));
    },
  });

  const stop = () => abortRef.current?.abort();

  return { ...mutation, stop } as UseMutationResult<TData, TError, MutationVariables<TPath, TMethod>, TContext> & { stop: () => void | undefined };
}

"use client"

import z, { ZodError } from "zod";

import { toast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { ResponseErrorConfig } from "@kubb/plugin-client/clients/axios";
import type { ErrorResponse } from "@/gen";

const ErrorList = ({ errors }: { errors: string[] }) => {
  if (errors.length === 1) return errors[0];
  return (
    <ul className="list-disc ml-5">
      {errors.map((error) => (
        <li>{error}</li>
      ))}
    </ul>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error instanceof ZodError) {
          const { errors } = z.treeifyError(error);

          toast({
            title: "Error",
            description: <ErrorList errors={errors} />,
            variant: "destructive",
          });
        } else if ("response" in error) {
          let message = (error as ResponseErrorConfig<ErrorResponse>)?.response?.data.error;
          if (message) {
            toast({
              title: "Error",
              description: message,
              variant: "destructive",
            });
            return;
          }
          message = (error as ResponseErrorConfig<{ message: string }>)?.response?.data.message
          if (message) {
            toast({
              title: "Error",
              description: message,
              variant: "destructive",
            });
          }
        }
      },
    },
  }
});

export const QueryClientContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
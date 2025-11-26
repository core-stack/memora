"use client"


import { toast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { ResponseErrorConfig } from "@kubb/plugin-client/clients/axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        toast({
          title: "Error",
          description: (error as ResponseErrorConfig<{ message: string }>).response?.data?.message,
          variant: "destructive",
        })
      },
    },
  }
})

export const QueryClientContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
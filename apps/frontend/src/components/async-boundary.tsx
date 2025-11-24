"use client"

import { AlertCircle } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { cn } from '@/lib/utils';

import type { ErrorResponse } from '@/gen';

type AsyncBoundarySize = "sm" | "md" | "lg" | "full"

interface AsyncBoundaryProps {
  size?: AsyncBoundarySize;
  message?: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: ErrorResponse | string;
  
}

const sizeClasses = {
  sm: {
    container: "min-h-[120px] gap-2",
    spinner: "h-6 w-6 border-2",
    icon: "h-5 w-5",
    title: "text-sm font-medium",
    message: "text-xs",
    button: "h-7 text-xs px-3",
  },
  md: {
    container: "min-h-[200px] gap-3",
    spinner: "h-8 w-8 border-2",
    icon: "h-6 w-6",
    title: "text-base font-semibold",
    message: "text-sm",
    button: "h-9 text-sm",
  },
  lg: {
    container: "min-h-[320px] gap-4",
    spinner: "h-12 w-12 border-[3px]",
    icon: "h-8 w-8",
    title: "text-lg font-semibold",
    message: "text-base",
    button: "h-10",
  },
  full: {
    container: "min-h-screen gap-6",
    spinner: "h-16 w-16 border-[3px]",
    icon: "h-12 w-12",
    title: "text-2xl font-bold",
    message: "text-lg",
    button: "h-11",
  },
}

export function AsyncBoundary({ size = "md", className, message, children, error, isLoading }: AsyncBoundaryProps) {
  if (isLoading) return <Loading className={className} message={message} size={size} />
  if (error) return <Error className={className} message={message} size={size} />
  return (
    <ErrorBoundary fallback={<Error className={className} message={message} size={size} />}>
      <Suspense fallback={<Loading className={className} message={message} size={size} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export type LoadingProps = Omit<AsyncBoundaryProps, "children" | "isLoading" | "error">;
export const Loading = ({ size = "md", message, className }: LoadingProps) => {
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn("flex flex-col items-center justify-center w-full", sizes.container, className)}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={cn("animate-spin rounded-full border-muted border-t-primary", sizes.spinner)} />
      {message && <p className={cn("text-muted-foreground text-center", sizes.message)}>{message}</p>}
    </div>
  )
}

export type ErrorProps = Omit<AsyncBoundaryProps, "children" | "isLoading">;
export const Error = ({ size = "md", message, className, error }: ErrorProps) => {
  const sizes = sizeClasses[size];
  if (error) {
    if (error instanceof Object) {
      message = error.error;
    } else { 
      message = error
    }
  }
  return (
    <div
      className={cn("flex flex-col items-center justify-center w-full text-center px-4", sizes.container, className)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className={cn("text-destructive", sizes.icon)} />
        </div>
        <div className="space-y-1">
          <h3 className={cn("text-foreground", sizes.title)}>Something went wrong</h3>
          {message && <p className={cn("text-muted-foreground max-w-md", sizes.message)}>{message}</p>}
        </div>
      </div>
    </div> 
  )
}
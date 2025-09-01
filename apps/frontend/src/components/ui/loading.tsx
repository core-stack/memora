"use client"

import type * as React from "react"
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import type { VariantProps } from "class-variance-authority"
const loadingVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      icon: "h-[1em] w-[1em]",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  /** Texto para leitores de tela */
  label?: string
  /** Ícone personalizado para o spinner */
  icon?: React.ReactNode
  /** Tipo de loading */
  variant?: "spinner" | "skeleton" | "pulse"
  /** Número de itens para skeleton/pulse (apenas para esses variantes) */
  count?: number
  /** Altura dos itens skeleton/pulse */
  height?: string
  /** Largura dos itens skeleton/pulse */
  width?: string | string[]
  /** Forma dos itens skeleton/pulse */
  shape?: "circle" | "square" | "rect"
  /** Se deve mostrar o texto de carregando */
  showText?: boolean
}

export function Loading({
  label = "Carregando...",
  icon,
  size,
  variant = "spinner",
  count = 3,
  height = "h-12",
  width = "w-full",
  shape = "rect",
  showText = false,
  className,
  ...props
}: LoadingProps) {
  // Função para renderizar o spinner
  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-2" {...props}>
      {icon ? (
        <div className={cn(loadingVariants({ size }), className)}>{icon}</div>
      ) : (
        <Loader2 className={cn(loadingVariants({ size }), className)} />
      )}
      {showText && <p className="text-sm text-muted-foreground">{label}</p>}
      <span className="sr-only">{label}</span>
    </div>
  )

  // Função para renderizar skeletons
  const renderSkeleton = () => {
    const widths = Array.isArray(width) ? width : Array(count).fill(width)
    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-md aspect-square",
      rect: "rounded-md",
    }

    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "animate-pulse bg-muted",
              height,
              widths[index % widths.length],
              shapeClasses[shape],
              className,
            )}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  // Função para renderizar pulse
  const renderPulse = () => {
    const widths = Array.isArray(width) ? width : Array(count).fill(width)
    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-md aspect-square",
      rect: "rounded-md",
    }

    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={cn("flex items-center space-x-4", className)}>
            {shape === "circle" && (
              <div className={cn("animate-pulse bg-muted rounded-full h-12 w-12")} aria-hidden="true" />
            )}
            <div className="space-y-2 flex-1">
              <div className={cn("animate-pulse bg-muted h-4", widths[index % widths.length])} aria-hidden="true" />
              {shape === "rect" && <div className="animate-pulse bg-muted h-4 w-[60%]" aria-hidden="true" />}
            </div>
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  // Renderizar o tipo de loading apropriado
  switch (variant) {
    case "skeleton":
      return renderSkeleton()
    case "pulse":
      return renderPulse()
    case "spinner":
    default:
      return renderSpinner()
  }
}

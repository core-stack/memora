"use client"
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [realType, setRealType] = React.useState(type);
    return (
      <div className='relative'>
        <input
          type={realType}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          type === "password" && (
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              className='absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent'
              onClick={() => setRealType(realType === "password" ? "text" : "password")}
            >
              { realType === "password" && <Eye className="w-4 h-4 text-input" /> }
              { realType === "text" && <EyeOff className="w-4 h-4 text-input" /> }
            </Button>
          )
        }
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

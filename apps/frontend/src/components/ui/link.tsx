import * as React from 'react';
import { Link as RouterLink } from 'react-router';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<"a"> & {
  href: string;
}
const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ className, type, href,...props }, ref) => {
    const [path, query] = href?.split("?");
    return (
      <RouterLink
        {...props}
        ref={ref}
        className={cn(className)}
        to={{
          pathname: path,
          search: query ? `?${query}` : "",
        }}
      />
    )
  }
)
Link.displayName = "Link"

export { Link }

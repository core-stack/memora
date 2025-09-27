import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { IndexStatus } from "@memora/schemas";

interface IndexingStatusBadgeProps {
  status?: IndexStatus;
  className?: string;
  showText?: boolean;
}

const statusConfig: Record<IndexStatus, { icon: any; label: string; className: string; animate?: boolean }> = {
  "PENDING": {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  "INDEXING": {
    icon: Loader2,
    label: "Indexing",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    animate: true,
  },
  "INDEXED": {
    icon: CheckCircle,
    label: "Indexed",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  "ERROR": {
    icon: XCircle,
    label: "Failed",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
}

export function IndexStatusBadge({ status, className, showText = false }: IndexingStatusBadgeProps) {
  if (!status) status = "PENDING";
  const config = statusConfig[status];
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <Icon className={cn("h-3 w-3", config.animate && "animate-spin", showText && "mr-1")} />
      {showText && <span className="text-xs">{config.label}</span>}
    </Badge>
  )
}
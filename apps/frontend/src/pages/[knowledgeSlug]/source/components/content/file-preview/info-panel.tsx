"use client"

import {
  Calendar, Clock, Copy, Edit3, FileText, HardDrive, Hash, Share, Trash2, X
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DateFormat, useDateTimeFormat } from '@/hooks/use-date-time-format';
import { cn } from '@/lib/utils';
import { formatBytes, formatDuration } from '@/utils/format';
import { SourceType } from '@memora/schemas';

import { IndexStatusBadge } from './index-status-badge';

import type { Source } from '@memora/schemas';

interface FileInfoPanelProps {
  item?: Source;
  isLoading: boolean;
  onClose?: () => void
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export function FileInfoPanel({ item, onClose, onEdit, onDelete, onShare, className }: FileInfoPanelProps) {
  const formatDate = useDateTimeFormat();

  return (
    <Card className={cn("w-80 h-fit", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Properties
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate flex-1">{item?.name}</h3>
            <IndexStatusBadge status={item?.indexStatus} />
          </div>
          {/* <p className="text-sm text-muted-foreground truncate">{item.path}</p> */}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="secondary" className="text-xs">
              {item?.sourceType}
            </Badge>
          </div>

          {item?.metadata.type !== SourceType.LINK && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Size
              </span>
              <span className="text-sm font-mono">{formatBytes(item?.metadata.size)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Modified
            </span>
            <span className="text-sm">{formatDate(item?.updatedAt, DateFormat.lll)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" />
              ID
            </span>
            <div className='flex items-center'>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{item?.id.slice(0, 8)}...</span>
              <Button variant="ghost" size="icon" className='ml-1'>
                <Copy />
              </Button>
            </div>
          </div>
        </div>

        {item?.metadata && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Metadata</h4>

              {item?.metadata.type !== SourceType.LINK && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Content Type</span>
                  <span className="text-sm font-mono">{item?.metadata.contentType}</span>
                </div>
              )}

              {/* {item?.metadata.encoding && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Encoding</span>
                  <span className="text-sm font-mono">{item?.metadata.encoding}</span>
                </div>
              )} */}

              {item?.metadata.type === SourceType.IMAGE && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dimensions</span>
                  <span className="text-sm">
                    {item?.metadata.width} × {item?.metadata.height}
                  </span>
                </div>
              )}

              {item?.metadata.type === SourceType.VIDEO && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </span>
                  <span className="text-sm">{formatDuration(item?.metadata.duration)}</span>
                </div>
              )}

              {/* {item?.metadata.author && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Author
                  </span>
                  <span className="text-sm">{item?.metadata.author}</span>
                </div>
              )} */}

              {item?.description && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm bg-muted p-2 rounded text-pretty">{item?.description}</p>
                </div>
              )}

              {/* {item?.metadata.tags && item?.metadata.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item?.metadata.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </>
        )}

        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => item && onEdit(item?.id)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={() => item && onShare(item?.id)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
              onClick={() => item && onDelete(item?.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
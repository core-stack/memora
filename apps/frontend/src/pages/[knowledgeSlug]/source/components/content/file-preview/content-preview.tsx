"use client"

import {
  AlertCircle, Download, ExternalLink, Eye, ImageIcon, Loader2, Music, Video
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DateFormat, useDateTimeFormat } from '@/hooks/use-date-time-format';
import { formatBytes } from '@/utils/format';
import { SourceType } from '@memora/schemas';

import { IndexStatusBadge } from './index-status-badge';

import type { Source } from "@memora/schemas";

type Props = {
  data?: Source;
  isLoading: boolean;
}
export function ContentPreview({ isLoading, data }: Props) {
  
  const formatDate = useDateTimeFormat();

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      )
    }
    if (data?.indexStatus) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p>File not indexed yet</p>
            <IndexStatusBadge status={data?.indexStatus} showText />
          </div>
        </div>
      )
    }

    switch (data?.sourceType) {

      case SourceType.IMAGE:
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                  {data.metadata?.dimensions
                    ? `${data.metadata.dimensions.width} × ${data.metadata.dimensions.height}`
                    : "Image file"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Open in viewer
              </Button>
            </div>
          </div>
        )

      case SourceType.VIDEO:
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Video className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">{data.name}</p>
                <p className="text-sm text-muted-foreground">Video file</p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Play video
              </Button>
            </div>
          </div>
        )

      case SourceType.AUDIO:
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Music className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">{data.name}</p>
                <p className="text-sm text-muted-foreground">Audio file</p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Play audio
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg truncate">{data?.originalName}</CardTitle>
            <IndexStatusBadge status={data?.indexStatus} />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {data?.sourceType}
          </Badge>
          {data?.size && <span>{formatBytes(data?.size)}</span>}
          <span>•</span>
          { data?.updatedAt && <span>{formatDate(data?.updatedAt, DateFormat.lll)}</span>}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0">
        {renderPreview()}
      </CardContent>
    </Card>
  )
}
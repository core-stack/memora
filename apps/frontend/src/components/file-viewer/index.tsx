import { Download } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/use-api-query';
import {
  IndexStatusBadge
} from '@/pages/[knowledgeSlug]/source/components/content/file-preview/index-status-badge';
import { DateFormat, formatBytes, formatDate } from '@/utils/format';

import { PDFViewer } from './pdf';

import type { Source } from '@snipet/schemas';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { useDownload } from '@/hooks/use-download';
type Props = {
  source?: Source;
  isLoading: boolean;
}

export const FileViewer = ({ source }: Props) => {
  const { toast } = useToast();
  const { data: preview } = useApiQuery(
    "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:sourceId/view",
    { method: "GET", params: { sourceId: source?.id }, enabled: !!source?.id }
  );
  const { download } = useDownload();
  const { mutate } = useApiMutation(
    "/api/tenant/:tenantId/knowledge/:knowledgeSlug/source/:id/download-url",
    { method: "GET" }
  )

  const [showHeader, setShowHeader] = useState(false);

  const handleDownload = () => {
    if (!source) return;
    mutate(
      { params: { id: source?.id } },
      {
        onSuccess: (data) => {
          download(data.url, source?.originalName);
        },
        onError: (error) => {
          toast({
            title: "Error downloading file",
            description: (error as Error).message,
            variant: "destructive",
          })
        }
      },
    );
  }
  return (
    <Card
      className="flex flex-col w-full h-full relative overflow-hidden group"
    >
      <CardHeader
        className={`
          absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm transition-all duration-300
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
        onMouseEnter={() => setShowHeader(true)}
        onMouseLeave={() => setShowHeader(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg truncate">{source?.originalName}</CardTitle>
            <IndexStatusBadge status={source?.indexStatus} />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {source?.metadata.type}
          </Badge>
          <span>{formatBytes(source?.metadata.size)}</span>
          <span>•</span>
          { source?.updatedAt && <span>{formatDate(source?.updatedAt, DateFormat.lll)}</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {
          preview?.url && (
            <PDFViewer file={preview.url} />
          )
        }
        {
          !preview?.url && (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">No preview available</span>
            </div>
          )
        }
      </CardContent>
      <div className="absolute top-0 left-0 right-0 h-12 z-9" onMouseEnter={() => setShowHeader(true)} />
    </Card>
  );
}
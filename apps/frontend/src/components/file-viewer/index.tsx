import { Download } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiSourceDownload, useApiSourceViewSuspense } from '@/gen';
import { useDownload } from '@/hooks/use-download';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';
import { useToast } from '@/hooks/use-toast';
import {
  IndexStatusBadge
} from '@/pages/[knowledgeSlug]/source/components/content/file-preview/index-status-badge';
import { DateFormat, formatBytes, formatDate } from '@/utils/format';

import { AsyncBoundary } from '../async-boundary';
import { PDFViewer } from './pdf';

import type { KnowledgeEntity, SourceEntity, TenantEntity } from '@/gen';

export const FileViewer = ({ source }: { source?: SourceEntity }) => {
  const { tenant, error: tenantError, isLoading } = useTenant();
  const { knowledge, error: knowledgeError } = useKnowledge();
  const error = tenantError || knowledgeError;

  return (
    <AsyncBoundary error={error} isLoading={isLoading}>
      <Component source={source} knowledge={knowledge!} tenant={tenant!} />
    </AsyncBoundary>
  )
}

type Props = {
  source?: SourceEntity;
  tenant: TenantEntity;
  knowledge: KnowledgeEntity;
}

const Component = ({ source, knowledge, tenant }: Props) => {
  const { toast } = useToast();
  const { data: preview } = useApiSourceViewSuspense({
    id: source?.id ?? "",
    tenantId: tenant.id,
    knowledgeId: knowledge.id
  });

  const { download } = useDownload();
  const { mutate } = useApiSourceDownload();

  const [showHeader, setShowHeader] = useState(false);

  const handleDownload = () => {
    if (!source) return;
    mutate(
      { id: source?.id ?? "", tenantId: tenant.id, knowledgeId: knowledge.id },
      {
        onSuccess: (data) =>  download(data.url, source?.originalName),
        onError: (error) => toast({ title: "Error downloading file", description: (error as Error).message, variant: "destructive" })
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
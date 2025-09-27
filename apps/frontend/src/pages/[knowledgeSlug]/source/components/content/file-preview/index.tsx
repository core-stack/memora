"use client"



import { useApiQuery } from '@/hooks/use-api-query';

import { useSource } from '../../../hooks/use-source';
import { ContentPreview } from './content-preview';
import { FileInfoPanel } from './info-panel';

export function FileContentViewer() {
  const { selectedFileId } = useSource();

  const { data, isLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/source/:id",
    { method: "GET", params: { id: selectedFileId ?? "" }, enabled: !!selectedFileId }
  );
  return (
    <div className='flex gap-4 p-2 h-full'>
      <ContentPreview isLoading={isLoading} data={data} />
      <FileInfoPanel item={data} isLoading={isLoading} />
    </div>
  )
}

"use client"

import { useApiSourceByID } from '@/gen';
import { useSource } from '../../../hooks/use-source';
import { ContentPreview } from './content-preview';
import { FileInfoPanel } from './info-panel';
import { useTenant } from '@/hooks/use-tenant';
import { useKnowledge } from '@/hooks/use-knowledge';

export function FileContentViewer() {
  const { selectedFileId } = useSource();
  const { tenant } = useTenant();
  const { knowledge } = useKnowledge();
  const { data, isLoading } = useApiSourceByID(selectedFileId ?? "", tenant?.id ?? "", knowledge?.id ?? "");

  return (
    <div className='flex gap-2 p-2 h-full'>
      <ContentPreview isLoading={isLoading} data={data} />
      <FileInfoPanel item={data} isLoading={isLoading} />
    </div>
  )
}

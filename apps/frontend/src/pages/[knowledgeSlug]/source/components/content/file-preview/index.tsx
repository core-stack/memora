"use client"

import { AsyncBoundary } from '@/components/async-boundary';
import { useApiSourceByIDSuspense } from '@/gen';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';

import { useSource } from '../../../hooks/use-source';
import { ContentPreview } from './content-preview';
import { FileInfoPanel } from './info-panel';

import type { KnowledgeEntity, TenantEntity } from '@/gen';

export function FileContentViewer() {
  const { tenant } = useTenant();
  const { knowledge } = useKnowledge();

  return ( 
    <AsyncBoundary>
      <Component knowledge={knowledge!} tenant={tenant!} />
    </AsyncBoundary>
  )
}

type Props = {
  knowledge: KnowledgeEntity;
  tenant: TenantEntity;
}
function Component({ knowledge, tenant }: Props) {
  const { selectedFileId } = useSource();
  const { data } = useApiSourceByIDSuspense({ id: selectedFileId ?? "", tenantId: tenant.id, knowledgeId: knowledge.id });

  return (
    <div className='flex gap-2 p-2 h-full'>
      <ContentPreview data={data} />
      <FileInfoPanel item={data} />
    </div>
  )
}

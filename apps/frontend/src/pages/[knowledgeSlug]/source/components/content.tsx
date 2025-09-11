import { Cpu } from 'lucide-react';

import { DocumentViewer } from '@/components/document-viewer';
import { useTreeSource } from '@/components/tree-source/hooks/use-tree-source';
import { useKnowledge } from '@/hooks/use-knowledge';

export const SourcePageContent = () => {
  const { slug } = useKnowledge();
  const { selectedFileId } = useTreeSource();
  if (!slug || !selectedFileId) {
    return (
      <div>
        <Cpu />
        No selected document
      </div>
    )
  }
  return (
    <DocumentViewer type="remote" sourceId={selectedFileId} />
  )
}
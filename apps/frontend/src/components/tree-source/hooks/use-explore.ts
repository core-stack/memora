import { useApiQuery } from '@/hooks/use-api-query';

import type { KnowledgeFolder, KnowledgeFolderFilter, Source, SourceFilter } from "@memora/schemas";
export const useExplore = (parentId: string | null = null) => {
  const { data: folders, error: folderError, isLoading: folderLoading } = useApiQuery<KnowledgeFolder[], KnowledgeFolderFilter>(
    `/api/knowledge/:knowledge_slug/folder`,
    { query: { filter: { parentId } } }
  );
  const { data: sources, error: sourceError, isLoading: sourceLoading } = useApiQuery<Source[], SourceFilter>(
    `/api/knowledge/:knowledge_slug/source`,
    { 
      query: { filter: { folderId: parentId } },
      refetchInterval: (query) =>  query.state.data?.some((s) => ["PENDING", "INDEXING"].includes(s.indexStatus)) ? 5000 : false
    }
  );

  const isLoading = folderLoading || sourceLoading;
  const error = folderError || sourceError;
  const data = [...(folders || []), ...(sources || [])];

  return { isLoading, error, data }
}
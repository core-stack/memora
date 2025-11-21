import { useApiFolder, useApiSource } from '@/gen';

export const useExplorer = (tenantId: string, knowledgeId: string, parentId?: string, enabled: boolean = true) => {
  const { data: folders, error: folderError, isLoading: folderLoading } = useApiFolder(
    tenantId,
    knowledgeId,
    { "filter[parentId]": parentId },
    { query: { enabled } }
  );

  const { data: sources, error: sourceError, isLoading: sourceLoading } = useApiSource(
    tenantId,
    knowledgeId,
    { "filter[folderId]": parentId },
    { 
      query: {
        enabled,
        refetchInterval: (query) =>  query.state.data?.some((s) => ["PENDING", "INDEXING"].includes(s.indexStatus)) ? 5000 : false
      }
    }
  );

  const isLoading = folderLoading || sourceLoading;
  const error = folderError || sourceError;
  const data = [...(folders || []), ...(sources || [])];

  return { isLoading, error, data }
}
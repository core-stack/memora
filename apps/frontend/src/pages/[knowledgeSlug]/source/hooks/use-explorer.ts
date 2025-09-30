import { useApiQuery } from '@/hooks/use-api-query';

export const useExplorer = (parentId: string | null = null, enabled: boolean = true) => {
  const { data: folders, error: folderError, isLoading: folderLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/folder",
    { method: "GET", query: { filter: { parentId } }, enabled }
  );
  const { data: sources, error: sourceError, isLoading: sourceLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/source",
    {
      method: "GET",
      query: { filter: { folderId: parentId } },
      refetchInterval: (query) =>  query.state.data?.some((s) => ["PENDING", "INDEXING"].includes(s.indexStatus)) ? 5000 : false,
      enabled
    }
  );

  const isLoading = folderLoading || sourceLoading;
  const error = folderError || sourceError;
  const data = [...(folders || []), ...(sources || [])];

  return { isLoading, error, data }
}
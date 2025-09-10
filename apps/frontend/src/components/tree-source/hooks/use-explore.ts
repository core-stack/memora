import { useApiQuery } from '@/hooks/use-api-query';

export const useExplore = (parentId: string | null = null) => {
  const { data: folders, error: folderError, isLoading: folderLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/folder",
    { method: "GET", query: { filter: { parentId } } }
  );
  const { data: sources, error: sourceError, isLoading: sourceLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/source",
    {
      method: "GET",
      query: { filter: { folderId: parentId } },
      refetchInterval: (query) =>  query.state.data?.some((s) => ["PENDING", "INDEXING"].includes(s.indexStatus)) ? 5000 : false
    }
  );

  const isLoading = folderLoading || sourceLoading;
  const error = folderError || sourceError;
  const data = [...(folders || []), ...(sources || [])];

  return { isLoading, error, data }
}
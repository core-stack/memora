import { useApiFolder, useApiSource } from '@/gen';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';

export const useExplorer = (tenantId?: string, knowledgeId?: string, parentId?: string, enabled: boolean = true) => {
  const { tenant } = useTenant();
  const { knowledge } = useKnowledge();

  const { data: folders, error: folderError, isLoading: folderLoading } = useApiFolder(
    { 
      tenantId: tenantId ?? tenant?.id ?? "",
      knowledgeId: knowledgeId ?? knowledge?.id ?? "",
      params: { "filter[parentId]": parentId }
    },
    { query: { enabled } }
  );

  const { data: sources, error: sourceError, isLoading: sourceLoading } = useApiSource(
    {
      tenantId: tenantId ?? tenant?.id ?? "",
      knowledgeId: knowledgeId ?? knowledge?.id ?? "",
      params: { "filter[folderId]": parentId }
    },
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
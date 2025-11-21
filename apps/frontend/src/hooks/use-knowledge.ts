import { useApiKnowledge, type KnowledgeEntity } from "@/gen";
import { useParams } from "./use-params";
import { useTenant } from "./use-tenant";

export const useKnowledge = (): { slug: string | undefined, knowledge: KnowledgeEntity | undefined } => {
  const { tenant } = useTenant();
  const { knowledgeSlug } = useParams<{ knowledgeSlug: string }>();
  const { data = [] } = useApiKnowledge(
    tenant?.id ?? "",
    { "filter[slug]": knowledgeSlug },
    { query: { enabled: !!knowledgeSlug && !!tenant?.id } }
  );

  if (!knowledgeSlug || knowledgeSlug === "") console.warn("Missing knowledge knowledgeSlug", knowledgeSlug);
  return { slug: knowledgeSlug, knowledge: data?.[0] ?? undefined };
}
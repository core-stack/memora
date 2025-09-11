import { useParams } from "./use-params";

export const useKnowledge = () => {
  const { knowledgeSlug } = useParams<{ knowledgeSlug: string }>();
  if (!knowledgeSlug || knowledgeSlug === "") console.warn("Missing knowledge knowledgeSlug", knowledgeSlug);
  return { slug: knowledgeSlug };
}
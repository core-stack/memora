import { useParams } from './use-params';

export const useKnowledge = () => {
  const { knowledge_slug } = useParams<{ knowledge_slug: string }>();
  if (!knowledge_slug || knowledge_slug === "") console.warn("Missing knowledge knowledge_slug", knowledge_slug);
  return { slug: knowledge_slug };
}
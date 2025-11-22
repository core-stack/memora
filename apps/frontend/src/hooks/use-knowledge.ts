import { useApiKnowledge } from '@/gen';

import { useParams } from './use-params';
import { useTenant } from './use-tenant';

import type  { KnowledgeEntity } from "@/gen";

export const useKnowledge = (): { slug?: string, knowledge?: KnowledgeEntity, error?: string } => {
  const { tenant, error: tenantError } = useTenant();
  const { knowledgeSlug } = useParams<{ knowledgeSlug: string }>();
  const { data = [] } = useApiKnowledge(
    { tenantId: tenant?.id ?? "", params: { "filter[slug]": knowledgeSlug } },
    { query: { enabled: !!knowledgeSlug && !!tenant?.id } }
  );

  const error = () => {
    if (tenantError) {
      if (typeof tenantError === "object") {
        return tenantError.error;
      } else { 
        return tenantError
      }
    }
    if (!knowledgeSlug) return "Invalid knowledge";
    if (!tenant) return "No tenant selected";
  }

  return { slug: knowledgeSlug, knowledge: data?.[0] ?? undefined, error: error() };
}
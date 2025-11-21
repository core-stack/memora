import { Database, Plus } from 'lucide-react';

import { TenantPageHeader } from '@/components/tenant-page-header';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';
import { useTenant } from '@/hooks/use-tenant';

import { KnowledgeList } from '../components/knowledge/knowledge-list';

export default function Home() {
  const { openDialog } = useDialog();
  const { tenant } = useTenant();
  if (!tenant) return null;

  return (
    <>
      <TenantPageHeader
        title='Knowledge Bases'
        description='Manage your knowledge bases and organize your documents'
        icon={<Database className="h-6 w-6 text-primary" />}
        action={{
          text: "Add Knowledge Base",
          action: () => openDialog({ type: DialogType.CREATE_OR_UPDATE_KNOWLEDGE }),
          icon: <Plus className="h-5 w-5 mr-2" />
        }}
      />
      <KnowledgeList tenantId={tenant.id} />
    </>
  )
}

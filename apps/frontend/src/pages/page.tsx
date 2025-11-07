import { Database, Plus } from 'lucide-react';

import { TenantPageHeader } from '@/components/tenant-page-header';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { KnowledgeList } from './components/knowledge-list';

export default function Home() {
  const { openDialog } = useDialog();

  return (
    <>
      <TenantPageHeader
        title='Knowledge Bases'
        description='Manage your knowledge bases and organize your documents'
        icon={<Database className="h-6 w-6 text-primary" />}
        action={{
          text: "Knowledge Base",
          action: () => openDialog({ type: DialogType.SELECT_LLM_PRESET }),
          icon: <Plus className="h-5 w-5 mr-2" />
        }}
      />
      <KnowledgeList />
    </>
  )
}

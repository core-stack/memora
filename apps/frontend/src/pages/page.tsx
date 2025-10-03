import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';

import { KnowledgeList } from './components/knowledge-list';

export default function Home() {
  const { data: knowledges = [] } = useApiQuery("/api/knowledge", { method: "GET" });
  const { openDialog } = useDialog();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Knowledge Bases</h1>
            <p className="text-muted-foreground">Manage your knowledge bases and organize your documents</p>
          </div>
          <Button onClick={() => openDialog({ type: DialogType.CREATE_OR_UPDATE_KNOWLEDGE })} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Knowledge Base
          </Button>
        </div>

        <KnowledgeList knowledges={knowledges} />
      </div>
    </div>
  )
}

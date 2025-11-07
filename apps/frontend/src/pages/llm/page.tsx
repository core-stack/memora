"use client"

import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { TenantPageHeader } from '@/components/tenant-page-header';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogType } from '@/dialogs';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';

import { LLMListItem } from './components/llm-list-item';

export default function LLMManagementPage() {
  const { openDialog } = useDialog();
  const { data: llms = [] } = useApiQuery("/api/tenant/:tenantId/llm", { method: "GET", query: { order: { createdAt: "DESC" } } });
  const { data: presets = [] } = useApiQuery("/api/tenant/:tenantId/llm/presets", { method: "GET" });
  const [activeTab, setActiveTab] = useState("all")

  const filteredLLMs = activeTab === "all" ? llms : llms.filter((llm) => llm.type === activeTab);

  return (
    <>
      {/* Header */}
      <TenantPageHeader
        title='LLM Management'
        description='Configure and manage your language models'
        icon={<Sparkles className="h-6 w-6 text-primary" />}
        action={{
          text: "Add LLM",
          action: () => openDialog({ type: DialogType.SELECT_LLM_PRESET }),
          icon: <Plus className="h-5 w-5 mr-2" />
        }}
      />

      {/* Tabs Filter */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({llms.length})</TabsTrigger>
            <TabsTrigger value="TEXT">Text ({llms.filter((l) => l.type === "TEXT").length})</TabsTrigger>
            <TabsTrigger value="EMBEDDING">Embedding ({llms.filter((l) => l.type === "EMBEDDING").length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredLLMs.length > 0 ? (
        <ScrollArea className='h-[65vh]'>
          <div className="space-y-3 pr-3">
            {filteredLLMs.map((llm) => (
              <LLMListItem
                key={llm.id} 
                llm={llm}
                preset={presets.find((p) => p.config.model === llm.model)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No LLMs configured yet</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first language model</p>
          <Button onClick={() => openDialog({ type: DialogType.SELECT_LLM_PRESET })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First LLM
          </Button>
        </div>
      )}
    </>
  )
}

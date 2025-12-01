"use client"

import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { AsyncBoundary } from '@/components/async-boundary';
import { TenantPageHeader } from '@/components/tenant-page-header';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogType } from '@/dialogs';
import { useApiLLMGetPresetsSuspense, useApiLLMSuspense } from '@/gen';
import { useDialog } from '@/hooks/use-dialog';
import { useTenant } from '@/hooks/use-tenant';

import { LLMListItem } from './components/llm-list-item';

import type { TenantEntity } from "@/gen";

export default function LLMManagementPage() {
  const { tenant, isLoading, error } = useTenant();
  return (
    <AsyncBoundary error={error} isLoading={isLoading}>
      <Page tenant={tenant!} />
    </AsyncBoundary>
  )
}

function Page({ tenant }: { tenant: TenantEntity }) {
  const { openDialog } = useDialog();

  const { data: llms = [] } = useApiLLMSuspense({
    tenantId: tenant.id,
    params: { sort: [ 'createdAt' ] }
  });

  const { data: presets = [] } = useApiLLMGetPresetsSuspense({ tenantId: tenant.id });

  const [activeTab, setActiveTab] = useState("all")

  const filteredLLMs = activeTab === "all" ? llms : llms.filter((llm) => llm.type === activeTab);

  const createLLM = () => {
    openDialog({
      type: DialogType.SELECT_LLM_PRESET,
      props: { tenantId: tenant.id }
    });
  }

  return (
    <>
      {/* Header */}
      <TenantPageHeader
        title='LLM Management'
        description='Configure and manage your language models'
        icon={<Sparkles className="h-6 w-6 text-primary" />}
        action={{
          text: "Add LLM",
          action: createLLM,
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
                preset={presets.find((p) => p.key === llm.key)}
                tenantId={tenant.id}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No LLMs configured yet</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first language model</p>
          <Button onClick={createLLM}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First LLM
          </Button>
        </div>
      )}
    </>
  )
}

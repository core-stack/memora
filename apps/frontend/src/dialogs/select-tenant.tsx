"use client"

import { Search } from 'lucide-react';
import { useState } from 'react';

import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';

import { DialogType } from './';

import type { TenantSchema } from '@snipet/schemas';
export type SelectTenantDialogProps = {
  tenants: TenantSchema[];
  setTenant: (tenantId: string) => void;
}
export function SelectTenantDialog({ setTenant, tenants }: SelectTenantDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { closeDialog } = useDialog();
  const invalidate = useApiInvalidate();
  const filteredTenants = tenants?.filter(preset => preset.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const handleSelectTenant = (tenantId: string) => {
    setTenant(tenantId);
    setSearchQuery("");
    setTimeout(() => invalidate());
    closeDialog(DialogType.SELECT_TENANT);
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Select Tenant</DialogTitle>
        <DialogDescription>Choose a tenant to use</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px]">
          {filteredTenants?.map((tenant) => (
            <div key={tenant.name} className='w-full pr-3 py-1'>
              <button
                key={tenant.name}
                onClick={() => handleSelectTenant(tenant.id)}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{tenant.description}</p>
                </div>
              </button>
            </div>
          ))}

          {filteredTenants?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No tenants found</div>
          )}
        </ScrollArea>
      </div>
    </DialogContent>
  )
}

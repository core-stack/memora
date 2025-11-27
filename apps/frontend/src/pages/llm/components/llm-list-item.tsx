"use client"

import { Settings, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogType } from '@/dialogs';
import { LLMQueryKeyFn, useApiLLMDelete } from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DateFormat, formatDate } from '@/utils/format';

import type { LLMEntity, LLMPreset } from '@/gen';

interface LLMListItemProps {
  tenantId: string;
  llm: LLMEntity;
  preset?: LLMPreset;
}

export function LLMListItem({ llm, preset, tenantId }: LLMListItemProps) {
  const invalidate = useApiInvalidate();
  const { toast } = useToast();
  const { openDialog } = useDialog();
  const { mutate } = useApiLLMDelete();

  const handleDelete = () => {
    openDialog({
      type: DialogType.CONFIRM,
      props: {
        title: "Delete LLM",
        description: `Are you sure you want to delete ${llm.name}?`,
        confirm: {
          text: "Yes",
          action: () => {
            mutate({ id: llm.id, tenantId }, {
              onSuccess: () => {
                toast({ title: "Delete LLM", description: "The LLM has been deleted." })
                invalidate(LLMQueryKeyFn({ tenantId }));
              }
            })
          }
        }
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn("relative h-10 w-10 shrink-0 rounded-lg flex items-center justify-center", !preset && "bg-muted")}>
              { !preset && <Settings className="h-6 w-6 text-muted-foreground" /> }
              { preset && <img src={preset.iconPath} alt={preset.name} width={48} height={48} className="object-cover" /> }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground truncate">{llm.name}</h4>
                <Badge
                  variant={preset?.config?.type === "TEXT" ? "default" : "secondary"}
                  className={cn("text-xs", preset?.config?.type === "TEXT" && "text-foreground")}
                >
                  {preset?.config?.type}
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <h4 className='text-foreground font-semibold'>Model:</h4>
                <p>{preset?.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">Created {formatDate(llm.createdAt, DateFormat.DATE_TIME)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

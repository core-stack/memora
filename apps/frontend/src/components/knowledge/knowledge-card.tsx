import { Calendar, ChartPie, Database, Edit, File, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DialogType } from '@/dialogs';
import { knowledgeQueryKeyFn, useApiKnowledgeDelete } from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DateFormat, formatBytes, formatDate } from '@/utils/format';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

import type { KnowledgeEntity } from '@/gen';
import type { ConfirmDialogProps } from '@/dialogs/confirm';
interface KnowledgeCardProps {
  knowledge: KnowledgeEntity;
}

export function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
  const { openDialog, closeDialog } = useDialog();
  const { mutate: deleteKnowledge } = useApiKnowledgeDelete();
  const { toast } = useToast();
  const invalidate = useApiInvalidate();
  const handleDelete = () => {
    openDialog({
      type: DialogType.CONFIRM,
      props: {
        title: "Delete knowledge base",
        description: "Are you sure you want to delete this knowledge base?",
        confirm: {
          text: "Yes", action: () => {
            deleteKnowledge({ id: knowledge.id, tenantId: knowledge.tenantId},
            {
              onSuccess: async () => {
                toast({
                  title: "Delete knowledge base",
                  description: "The knowledge base has been added to deletion queue, and will be deleted soon."
                })
                await invalidate(knowledgeQueryKeyFn({ tenantId: knowledge.tenantId }));
                closeDialog(DialogType.CONFIRM)
              }
            })
          }
        }
      } as ConfirmDialogProps
    })
  }

  const handleEdit = () => {
    openDialog({
      type: DialogType.CREATE_OR_UPDATE_KNOWLEDGE,
      props: { knowledge }
    })
  }

  return (
    <Card className={cn("p-6 hover:border-accent transition-colors", knowledge.status === "DELETING" && "opacity-30 pointer-events-none")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Database className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col mb-1">
              <Link href={`/${knowledge.slug}`} className="font-semibold text-lg truncate hover:underline">{knowledge.title}</Link>
              { knowledge.status === "DELETING" && <p>Deleting...</p> }
              { knowledge.status === "DELETE_ERROR" && <p className="text-destructive">{knowledge.deleteError}</p> }
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{knowledge.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <File className="h-4 w-4" />
                      <span>{knowledge.files}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{knowledge.files} files</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <ChartPie className="h-4 w-4" />
                      <span>{formatBytes(knowledge.storage)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatBytes(knowledge.storage)} used</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(knowledge.createdAt, DateFormat.DATE)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created At: {formatDate(knowledge.createdAt, DateFormat.DATE)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={handleEdit} title="Edit knowledge base">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete knowledge base"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

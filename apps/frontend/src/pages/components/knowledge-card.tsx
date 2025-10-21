import { Calendar, ChartPie, Database, Edit, File, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DialogType } from '@/dialogs';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { DateFormat, formatBytes, formatDate } from '@/utils/format';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

import type { Knowledge } from "@snipet/schemas";
import type { ConfirmDialogProps } from '@/dialogs/confirm';
interface KnowledgeCardProps {
  knowledge: Knowledge;
}

export function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
  const { openDialog, closeDialog } = useDialog();

  const { mutate: deleteKnowledge } = useApiMutation("/api/knowledge/:id", { method: "DELETE" });
  const { toast } = useToast();
  const handleDelete = () => {
    openDialog({
      type: DialogType.CONFIRM,
      props: {
        title: "Delete knowledge base",
        description: "Are you sure you want to delete this knowledge base?",
        confirm: {
          text: "Yes", action: () => {
            deleteKnowledge({
              params: { id: knowledge.id }
            }, {
              onSuccess: () => {
                toast({
                  title: "Delete knowledge base",
                  description: "The knowledge base has been added to deletion queue, and will be deleted soon."
                })
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
    <Card className="p-6 hover:border-accent transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Database className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/${knowledge.slug}`} className="font-semibold text-lg truncate hover:underline">{knowledge.title}</Link>
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

            <div>
              {
                knowledge.tags?.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="mr-2">
                    {tag.name}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
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

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormTextarea } from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  createKnowledgeDtoSchema, knowledgeQueryKeyFn, useApiKnowledgeCreate, useApiKnowledgeUpdate
} from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { DialogType } from './';

import type { KnowledgeEntity } from "@/gen";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export type CreateOrUpdateKnowledgeDialogProps = {
  knowledge?: KnowledgeEntity
  tenantId: string;
}
export const CreateOrUpdateKnowledgeDialog = ({ knowledge, tenantId }: CreateOrUpdateKnowledgeDialogProps) => {
  const { closeDialog } = useDialog();

  const isEditing = !!knowledge;
  
  const form = useForm({
    resolver: zodResolver(createKnowledgeDtoSchema),
    defaultValues: {
      title: knowledge?.title || "",
      description: knowledge?.description || "",
      slug: knowledge?.slug || "",
    }
  });

  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { toast } = useToast();

  const { mutateAsync: createKnowledge } = useApiKnowledgeCreate();
  const { mutateAsync: updateKnowledge } = useApiKnowledgeUpdate();

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(tenantId);
    
    try {
      if (isEditing) {
        await updateKnowledge({ id: knowledge?.id ?? "", tenantId, data });
      } else {
        await createKnowledge({ data, tenantId });
      }

      await invalidate(knowledgeQueryKeyFn({ tenantId }));
      closeDialog(DialogType.CREATE_OR_UPDATE_KNOWLEDGE);
      toast({
        title: isEditing ? "Knowledge updated" : "Knowledge created",
        description: isEditing ? "The knowledge has been updated successfully" : "The knowledge has been created successfully",
      })
    } catch (error) {
      toast({ title:"Error", description: (error as Error).message, variant: "destructive" });
      console.error(error);
    }
  });

  const watchName = form.watch("title");

  useEffect(() => {
    if (watchName && !isEditing) form.setValue("slug", generateSlug(watchName))
  }, [form, isEditing, watchName]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Update Knowledge" : "Create Knowledge"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update a knowledge" : "Create a new knowledge" }
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormInput
            name='title'
            placeholder='Title of knowledge'
            label='Title'
            required
            help='A name for the knowledge base'
          />
          <FormInput
            name='slug'
            placeholder='Slug of knowledge'
            label='Slug'
            disabled={isEditing}
            required
            help='A unique identifier for the knowledge base that will be used in the URL'
          />
          <FormTextarea
            name='description'
            placeholder='Description of knowledge'
            label='Description'
            help='A description for the knowledge base'
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog(DialogType.CREATE_OR_UPDATE_KNOWLEDGE)}
            >Cancel</Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
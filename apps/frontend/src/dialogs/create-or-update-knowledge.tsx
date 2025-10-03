import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormTextarea } from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKnowledgeSchema } from '@memora/schemas';

import { DialogType } from './';

import type { CreateKnowledge, Knowledge } from '@memora/schemas';
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export type CreateOrUpdateKnowledgeDialogProps = {
  knowledge?: Knowledge
}
export const CreateOrUpdateKnowledgeDialog = ({ knowledge }: CreateOrUpdateKnowledgeDialogProps) => {
  const { closeDialog } = useDialog();

  const isEditing = !!knowledge;
  const defaultValues: CreateKnowledge = {
    title: knowledge?.title || "",
    description: knowledge?.description || "",
    slug: knowledge?.slug || ""
  }

  const form = useForm<CreateKnowledge>({ resolver: zodResolver(createKnowledgeSchema), defaultValues });
  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate: createKnowledge } = useApiMutation("/api/knowledge", { method: "POST" });
  const { mutate: updateKnowledge } = useApiMutation("/api/knowledge/:id", { method: "PUT" });
  const onSubmit = form.handleSubmit(async (body) => {
    if (isEditing) {
      updateKnowledge({
        body: {
          description: body.description,
          title: body.title,
          id: knowledge!.id
        }, params: { id: knowledge!.id }
      }, {
        onSuccess: () => {
          invalidate("/api/knowledge");
          closeDialog(DialogType.CREATE_OR_UPDATE_KNOWLEDGE);
        }
      })
    } else {
      createKnowledge({ body }, {
        onSuccess: () => {
          invalidate("/api/knowledge");
          closeDialog(DialogType.CREATE_OR_UPDATE_KNOWLEDGE);
        }
      });
    }
  });

  const watchName = form.watch("title");

  useEffect(() => {
    if (watchName && !isEditing) form.setValue("slug", generateSlug(watchName))
  }, [watchName]);

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
          <FormInput name='title' placeholder='Title of knowledge' label='Title' />
          <FormInput name='slug' placeholder='Slug of knowledge' label='Slug' disabled={isEditing} />
          <FormTextarea name='description' placeholder='Description of knowledge' label='Description' />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog(DialogType.CREATE_OR_UPDATE_KNOWLEDGE)}
            >Cancel</Button>
            <Button type="submit" isLoading={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
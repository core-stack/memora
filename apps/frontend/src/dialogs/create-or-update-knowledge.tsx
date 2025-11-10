import { ChevronsUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormSelect } from '@/components/form/select';
import { FormTextarea } from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@/utils/zod-resolver';
import { createKnowledgeSchema } from '@snipet/schemas';

import { DialogType } from './';

import type { CreateKnowledge, Knowledge } from '@snipet/schemas';
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
  const defaultValues: Omit<CreateKnowledge, "embeddingModelId"> = {
    title: knowledge?.title || "",
    description: knowledge?.description || "",
    slug: knowledge?.slug || "",
    instructions: knowledge?.instructions || "",
    tags: knowledge?.tags.map(tag => tag.name) || []
  }

  const form = useForm<CreateKnowledge>({ resolver: zodResolver(createKnowledgeSchema), defaultValues });
  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { toast } = useToast();

  const { mutateAsync: createKnowledge } = useApiMutation("/api/tenant/:tenantId/knowledge", { method: "POST" });
  const { mutateAsync: updateKnowledge } = useApiMutation("/api/tenant/:tenantId/knowledge/:id", { method: "PUT" });
  const { data: llms = [] } = useApiQuery("/api/tenant/:tenantId/llm", { method: "GET", query: { filter: { type: "EMBEDDING" }} });

  const onSubmit = form.handleSubmit(async (body) => {
    try {
      if (isEditing) {
        await updateKnowledge({ body, params: { id: knowledge!.id } });
      } else {
        await createKnowledge({ body });
      }

      invalidate("/api/tenant/:tenantId/knowledge");
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
          <FormTextarea 
            name='description'
            placeholder='Description of knowledge'
            label='Description'
            help='A description for the knowledge base'
          />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className='w-full flex justify-between text-sm cursor-pointer pb-4'>
                Advanced Options
                <ChevronsUpDown className='w-4 h-4' />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6">
                <FormInput 
                  name='slug'
                  placeholder='Slug of knowledge'
                  label='Slug'
                  disabled={isEditing}
                  required
                  help='A unique identifier for the knowledge base that will be used in the URL'
                />
                <FormSelect 
                  name='embedding-model' 
                  data={llms.map(llm => ({ label: llm.name, value: llm.id}))}
                  placeholder='Select a embedding model'
                  label='Embedding Model'
                  defaultValue={isEditing ? knowledge?.embeddingModelId : llms.length > 0 ? llms[0].id : undefined}
                  required
                  help='The embedding model to use for the knowledge base'
                />
                <FormTextarea
                  name='instructions'
                  placeholder='Instructions of knowledge'
                  label='Instructions'
                  help='Instructions for the knowledge base'
                />
                <FormInput
                  name='tags' 
                  placeholder='Tags of knowledge' 
                  label='Tags'
                  help='Tags for the knowledge base'
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
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
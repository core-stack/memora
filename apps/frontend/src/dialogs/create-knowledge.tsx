import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormTextarea } from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';

import { DialogType } from './';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export const CreateKnowledgeDialog = () => {
  const { closeDialog } = useDialog();

  const form = useForm();
  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate } = useApiMutation("/api/knowledge");
  const onSubmit = form.handleSubmit(async (body) => {
    mutate({ body }, {
      onSuccess: () => {
        invalidate("/api/knowledge");
        closeDialog(DialogType.CREATE_KNOWLEDGE);
      }
    });
  });

  const watchName = form.watch("title");

  useEffect(() => {
    if (watchName) form.setValue("slug", generateSlug(watchName))
  }, [watchName]);

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{"Create Knowledge"}</DialogTitle>
        <DialogDescription>
          {"Create a new knowledge"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormInput name='title' placeholder='Title of knowledge' label='Title' />
          <FormInput name='slug' placeholder='Slug of knowledge' label='Slug' />
          <FormTextarea name='description' placeholder='Description of knowledge' label='Description' />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog(DialogType.CREATE_KNOWLEDGE)}
            >Cancel</Button>
            <Button type="submit" isLoading={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}
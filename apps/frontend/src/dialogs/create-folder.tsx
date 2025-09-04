import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKnowledgeFolderSchema } from '@memora/schemas';

import { DialogType } from './';

export const CreateKnowledgeFolderDialog = ({ slug }: { slug: string }) => {
  const { closeDialog } = useDialog();
  const form = useForm({ resolver: zodResolver(createKnowledgeFolderSchema) });
  const isLoading = form.formState.isSubmitting;
  const { mutate } = useApiMutation(`/api/knowledge/${slug}/folder`);
  const onSubmit = form.handleSubmit(async (body) => {
    mutate({ body }, {
      onSuccess: () => {
        closeDialog(DialogType.CREATE_FOLDER);
      }
    });
  });

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{"Create folder"}</DialogTitle>
        <DialogDescription>
          {"Create a new folder"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormInput name='name' placeholder='Folder name' label='Name' />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog(DialogType.CREATE_FOLDER)}
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
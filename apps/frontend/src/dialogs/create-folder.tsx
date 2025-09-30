import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';
import { useKnowledge } from '@/hooks/use-knowledge';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKnowledgeFolderSchema } from '@memora/schemas';

import { DialogType } from './';

export const CreateKnowledgeFolderDialog = ({ folderId }: { folderId?: string }) => {
  const { closeDialog } = useDialog();
  const { slug } = useKnowledge();
  const form = useForm({ resolver: zodResolver(createKnowledgeFolderSchema) });
  const isLoading = form.formState.isSubmitting;

  const { data: folder } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/folder/:id",
    { method: "GET", params: { id: folderId }, enabled: !!folderId }
  );

  const invalidate = useApiInvalidate();
  const { mutate } = useApiMutation('/api/knowledge/:knowledgeSlug/folder', { method: 'POST' });
  const onSubmit = form.handleSubmit(async (body) => {
    mutate({ body, params: { knowledgeSlug: slug! }, query: { parentId: folderId } }, {
      onSuccess: () => {
        invalidate('/api/knowledge/:knowledgeSlug/folder');
        invalidate('/api/knowledge/:knowledgeSlug/source');
        closeDialog(DialogType.CREATE_FOLDER);
      }
    });
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create folder</DialogTitle>
        <DialogDescription>Create a new folder</DialogDescription>
      </DialogHeader>
      { folder && <p className='text-sm font-bold py-2'>Parent folder: {folder.name}</p>}
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
    </DialogContent>
  )
}
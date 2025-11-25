import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  createFolderDtoSchema, folderQueryKeyFn, sourceQueryKeyFn, useApiFolderByID, useApiFolderCreate
} from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';

import { DialogType } from './';

export type CreateFolderDialogProps = {
  parentId?: string
  tenantId: string
  knowledgeId: string
}
export const CreateFolderDialog = ({ parentId, knowledgeId, tenantId }: CreateFolderDialogProps) => {
  const { closeDialog } = useDialog();
  const form = useForm({
    resolver: zodResolver(createFolderDtoSchema),
    defaultValues: { parentId, name: ""}
  });
  
  const isLoading = form.formState.isSubmitting;

  const { data: folder } = useApiFolderByID({
    id: parentId ?? "",
    knowledgeId,
    tenantId
  }, { query: { enabled: !!parentId } });

  const invalidate = useApiInvalidate();
  const { mutate } = useApiFolderCreate();
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ knowledgeId, tenantId, data }, {
      onSuccess: async () => {
        await invalidate(
          folderQueryKeyFn({ knowledgeId, tenantId }),
          sourceQueryKeyFn({ knowledgeId, tenantId }),
        );
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
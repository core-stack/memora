import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

import { CreateSourceFile } from './file';

export type CreateSourceDialogProps = {
  folderId?: string
}

export const CreateSourceDialog = ({ folderId }: CreateSourceDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Source</DialogTitle>
        <DialogDescription>Create a new source</DialogDescription>
      </DialogHeader>
      <CreateSourceFile folderId={folderId} />
    </DialogContent>
  )
}
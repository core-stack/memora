import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

import { CreateSourceFile } from './file';

export const CreateSourceDialog = ({ folderId }: { folderId?: string; }) => {
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
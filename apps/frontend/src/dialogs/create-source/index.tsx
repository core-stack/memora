import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

import { CreateSourceFile } from './file';

export type CreateSourceDialogProps = {
  folderId?: string
  knowledgeId: string
  tenantId: string
}

export const CreateSourceDialog = (props: CreateSourceDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Source</DialogTitle>
        <DialogDescription>Create a new source</DialogDescription>
      </DialogHeader>
      <CreateSourceFile {...props} />
    </DialogContent>
  )
}
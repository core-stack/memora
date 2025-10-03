import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { useDialog } from '@/hooks/use-dialog';

import { DialogType } from './';

export type ConfirmDialogProps = {
  title: string;
  description: string;
  confirm: { text?: string; action: () => void; icon?: React.ReactNode };
  cancel?: { text: string; action: () => void; icon?: React.ReactNode };
}
export const ConfirmDialog = ({ description, title, confirm, cancel }: ConfirmDialogProps) => {
  const { closeDialog } = useDialog();
  
  if (!cancel) cancel = { text: "No", action: () => closeDialog(DialogType.CONFIRM), icon: <X /> };
  if (!cancel.icon) cancel.icon = <X />;
  if (!cancel.text) cancel.text = "No";
  if (!confirm.icon) confirm.icon = <Check />;
  if (!confirm.text) confirm.text = "Yes";

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={cancel?.action}>
          {cancel?.icon} {cancel?.text}
        </Button>
        <Button onClick={confirm.action}>
          {confirm?.icon} {confirm?.text}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
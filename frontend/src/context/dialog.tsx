import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { createContext, useCallback, useState } from "react";

export type DialogComponents = Record<string, React.ComponentType<any>>;

type OpenDialogOptions = {
  type: string;
  props?: React.ComponentProps<any>;
  onClose?: () => void;
}

export type DialogState = {
  openDialog: (opts: OpenDialogOptions) => void;
  closeDialog: (type?: string) => void;
  closeAllDialogs: () => void;
};

export const DialogContext = createContext<DialogState | undefined>(undefined);

type DialogProviderProps<D extends DialogComponents> = {
  children: React.ReactNode;
  dialogs: D;
};

type DialogContainerProps = {
  dialogs: DialogComponents;
  dialogStack: OpenDialogOptions[];
  closeDialog: (type?: string) => void;
};
export const DialogContainer = ({
  dialogs,
  dialogStack,
  closeDialog,
}: DialogContainerProps) => {
  return (
    <>
      {dialogStack.map(({ type, props }, index) => {
        const DialogComponent = dialogs[type];
        if (!DialogComponent) {
          console.error(`Dialog ${type} not found`);
          return null;
        }
        return (
          <Dialog
            key={index}
            open
            onOpenChange={() => closeDialog(type)}
          >
            <DialogContent>
              <DialogComponent {...props} />
            </DialogContent>
          </Dialog>
        );
      })}
    </>
  );
};

export const DialogProvider = <D extends DialogComponents>({
  children,
  dialogs,
}: DialogProviderProps<D>) => {
  const [dialogStack, setDialogStack] = useState<OpenDialogOptions[]>([]);

  const openDialog = (opts: OpenDialogOptions) => {
    setDialogStack((prev) => [...prev, opts]);
  };

  const closeDialog = useCallback((type?: string) => {
    setDialogStack((prev) => {
      if (type) {
        const targetIndex = prev.findIndex((dialog) => dialog.type === type);
        const target = targetIndex >= 0 ? prev[targetIndex] : prev[prev.length - 1];
        if (target) target.onClose?.();
        return prev.filter((dialog) => dialog.type !== type);
      }
      const target = prev[prev.length - 1];
      if (target) target.onClose?.();
      return prev.slice(0, -1);
    });
  }, []);

  const closeAllDialogs = () => setDialogStack([]);

  return (
    <DialogContext.Provider value={{ closeAllDialogs, closeDialog, openDialog }}>
      {children}
      <DialogContainer dialogs={dialogs} dialogStack={dialogStack} closeDialog={closeDialog} />
    </DialogContext.Provider>
  );
};
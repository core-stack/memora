import { DialogProvider } from './context/dialog';
import { dialogs } from './dialogs';

export const RootProviders = ({ children }: {children: React.ReactNode}) => {
  return (
    <DialogProvider dialogs={dialogs}>
      {children}
    </DialogProvider>
  )
}
import { Toaster } from './components/ui/toaster';
import { DialogProvider } from './context/dialog';
import { QueryClientContext } from './context/query-client';
import { dialogs } from './dialogs';

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientContext>
      <DialogProvider dialogs={dialogs}>
        {children}
      </DialogProvider>
      <Toaster />
    </QueryClientContext>
  )
}
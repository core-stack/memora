import { CookiesProvider } from 'react-cookie';
import { Outlet } from 'react-router';

import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/auth';
import { DialogProvider } from './context/dialog';
import { QueryClientContext } from './context/query-client';
import { ThemeProvider } from './context/theme';
import { dialogs } from './dialogs';

export const RootProviders = () => {
  return (
    <ThemeProvider>
      <QueryClientContext>
        <CookiesProvider>
          <AuthProvider>
            <DialogProvider dialogs={dialogs}>
              <Outlet />
            </DialogProvider>
          </AuthProvider>
        </CookiesProvider>
        <Toaster />
      </QueryClientContext>
    </ThemeProvider>
  )
}
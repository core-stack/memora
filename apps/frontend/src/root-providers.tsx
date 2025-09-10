import { Outlet } from "react-router";

import { Toaster } from "./components/ui/toaster";
import { DialogProvider } from "./context/dialog";
import { QueryClientContext } from "./context/query-client";
import { dialogs } from "./dialogs";

export const RootProviders = () => {
  return (
    <QueryClientContext>
      <DialogProvider dialogs={dialogs}>
        <Outlet />
      </DialogProvider>
      <Toaster />
    </QueryClientContext>
  )
}
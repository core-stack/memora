import { DialogType } from "@/dialogs";
import { useApiQuery } from "@/hooks/use-api-query";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import type { TenantSchema } from "@snipet/schemas";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";

type TenantContextType = {
  tenant?: TenantSchema;
  setTenant: (tenantId: string) => void;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextType>({} as TenantContextType);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { openDialog } = useDialog();
  const { isAuthenticated } = useAuth();

  const [cookies, setCookies] = useCookies<
    "tenant-id", { ["tenant-id"]: string }
  >(["tenant-id"]);

  const { data: user, isLoading, refetch } = useApiQuery(
    "/api/user/self",
    { method: "GET", retry: false }
  );
  const tenantId = useMemo(() => cookies["tenant-id"], [cookies]);
  const tenant = user?.members.find((member) => member.tenantId === tenantId)?.tenant;

  const setTenant = useCallback(async (tenantId: string) => {
    console.log("set tenant");
    try {
      setCookies("tenant-id", { "tenant-id": tenantId });
      const res = await refetch();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
    console.log("set tenant end");

  }, [refetch, setCookies]);


  useEffect(() => {
    if (!tenant && isAuthenticated && !isOpenDialog) {
      setIsOpenDialog(true);
      openDialog({ type: DialogType.CREATE_TENANT });
    }
  }, [tenant, isAuthenticated, isOpenDialog, openDialog]);

  return (
    <TenantContext.Provider value={{
      tenant,
      setTenant,
      isLoading
    }}>
      {children}
    </TenantContext.Provider>
  )
}
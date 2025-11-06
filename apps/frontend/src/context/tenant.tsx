import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet } from 'react-router';

import { DialogType } from '@/dialogs';
import { useApiQuery } from '@/hooks/use-api-query';
import { useAuth } from '@/hooks/use-auth';
import { useDialog } from '@/hooks/use-dialog';

import type { TenantSchema } from "@snipet/schemas";
type TenantContextType = {
  tenant?: TenantSchema;
  tenants?: TenantSchema[];
  setTenant: (tenantId: string) => void;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextType>({} as TenantContextType);

export const TenantProvider = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { openDialog } = useDialog();
  const { isAuthenticated } = useAuth();
  const [canRender, setCanRender] = useState(false);

  const [cookies, setCookies] = useCookies<
    "tenant-id", { ["tenant-id"]: string }
  >(["tenant-id"]);

  const { data: user, isLoading, refetch } = useApiQuery(
    "/api/user/self",
    { method: "GET", retry: false }
  );
  const tenantId = useMemo(() => cookies["tenant-id"], [cookies]);
  const tenant = user?.members.find((member) => member.tenantId === tenantId)?.tenant;
  const tenants = user?.members.map((member) => member.tenant).filter((tenant) => !!tenant);

  const setTenant = useCallback(async (tenantId: string) => {
    try {
      setCookies("tenant-id", tenantId);
      setCanRender(true);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  }, [refetch, setCookies]);

  useEffect(() => {
    console.log(tenant, isAuthenticated, user);
    if (!tenant && isAuthenticated && !isOpenDialog) {
      console.log("no tenant");
      
      if (user && user.members.length) {
        setTenant(user.members[0].tenantId);
      } else {
        setIsOpenDialog(true);
        openDialog({ type: DialogType.CREATE_TENANT });
      }
    }
    if (tenant && !canRender) {
      setCanRender(true);
    }
  }, [tenant, isAuthenticated, isOpenDialog, openDialog, user]);

  return (
    <TenantContext.Provider value={{
      tenant,
      tenants,
      setTenant,
      isLoading
    }}>
      {canRender && <Outlet />}
    </TenantContext.Provider>
  )
}
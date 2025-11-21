import { createContext, useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { DialogType } from '@/dialogs';
import { useAuth } from '@/hooks/use-auth';
import { useDialog } from '@/hooks/use-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useApiUserSelf, type TenantEntity } from '@/gen';

type TenantContextType = {
  tenant?: TenantEntity;
  tenants?: TenantEntity[];
  setTenant: (tenantId: string) => void;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextType>({} as TenantContextType);

export const TenantProvider = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { openDialog } = useDialog();
  const { isAuthenticated } = useAuth();
  const [canRender, setCanRender] = useState(false);
  const [tenantId, setTenantId] = useLocalStorage<string>("tenant-id", null);

  const { data: user, isLoading, refetch } = useApiUserSelf({
    query: { retry: (failureCount) => failureCount < 1 }
  });

  const tenant = user?.members.find((member) => member.tenantId === tenantId)?.tenant;
  const tenants = user?.members.map((member) => member.tenant).filter((tenant) => !!tenant);

  const setTenant = useCallback(async (tenantId: string) => {
    try {
      setTenantId(tenantId);
      setCanRender(true);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  }, [refetch, setTenantId]);

  useEffect(() => {
    if (!tenant && tenantId) return setTenantId(null);
    if (!tenant && isAuthenticated) {
      if (tenants && tenants?.length > 0) {
        setTenant(tenants[0]?.id);
      } else if (!isOpenDialog) {
        setIsOpenDialog(true);
        openDialog({ type: DialogType.CREATE_TENANT });
      }
    }
    if (tenant && !canRender) {
      setCanRender(true);
    }
  }, [tenant, isAuthenticated, isOpenDialog, openDialog, tenants, canRender, setTenant, tenantId, setTenantId]);

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
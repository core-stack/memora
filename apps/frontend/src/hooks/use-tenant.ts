import { useContext } from 'react';

import { TenantContext } from '@/context/tenant';

export const useTenant = () => {
  return useContext(TenantContext);
}
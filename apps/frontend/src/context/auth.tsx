import type { GetSelfUserSchema, TenantSchema } from "@snipet/schemas";
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useRouter } from '@/hooks/use-router';
import { useToast } from '@/hooks/use-toast';
import { can as canPermission } from '@snipet/permission';

import type { Permission } from "@snipet/permission";
import { publicRoutes, REDIRECT_WHEN_NOT_AUTHENTICATED_PATH } from "@/routes";
import { useLocation } from "@/hooks/use-location";
type AuthContextType = {
  user: GetSelfUserSchema | undefined;
  currentTenant: TenantSchema | undefined;
  currentMember: GetSelfUserSchema["members"][0] | undefined;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  can: (permission: Permission | Permission[]) => boolean;
  canInTenant: (tenantId: string, permission: Permission | Permission[]) => boolean;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [exiting, setExiting] = useState(false);
  const [cookies] = useCookies<
    "tenant-id" | "access-token" | "refresh-token",
    { ["tenant-id"]: string }
  >(["tenant-id"]);

  const tenantId = useMemo(() => cookies["tenant-id"], [cookies]);

  const router = useRouter();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const { mutate } = useApiMutation("/api/auth/logout", { method: "POST" });
  const { data: user, isLoading, error } = useApiQuery("/api/user/self", { method: "GET", retry: false });

  const permissions = user?.members.map((member) => ({
    tenantId: member.tenantId,
    role: member.role,
  }));

  const isAuthenticated = !!user;
  const currentMember = user?.members.find((member) => member.tenantId === tenantId);
  const currentTenant = currentMember?.tenant;
  const canInTenant = (tenantId: string, permission: Permission | Permission[]): boolean => {
    if (permissions) {
      return canPermission(
        permissions.find((p) => p.tenantId === tenantId)?.role.permissions ?? [],
        Array.isArray(permission) ? permission : [permission]
      );
    }
    return false;
  }

  const can = (permission: Permission | Permission[]): boolean => canInTenant(tenantId, permission);

  const logout = useCallback(() => {
    setExiting(true);
    setExiting(true);
    mutate({}, {
      onSuccess: () => {
        router.replace("/login");
        setExiting(false);
      },
      onError: (error) => {
        toast({
          title: "Error logging out",
          description: (error as Error).message,
          variant: "destructive",
        })
        setExiting(false);
      },
    })
  }, [mutate, router, toast]);

  useEffect(() => {
    if (isLoading) return;
    const publicRoute = publicRoutes.find(route => pathname.startsWith(route.path));
    if (!isAuthenticated && publicRoute) return;
    else if (isAuthenticated && publicRoute && publicRoute.whenAuthenticated === "redirect") router.replace("/");
    else if (!publicRoute && !isAuthenticated) router.replace(REDIRECT_WHEN_NOT_AUTHENTICATED_PATH);
    else if (error && error.statusCode === 401 && !exiting) logout();
  }, [isAuthenticated, pathname, router, error, exiting, logout, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentTenant,
        currentMember,
        isLoading,
        isAuthenticated,
        logout,
        can,
        canInTenant,
      }}
    >
      { isLoading ? <div>Loading...</div> : children }
    </AuthContext.Provider>
  )
}
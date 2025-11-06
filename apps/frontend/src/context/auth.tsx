import type { GetSelfUserSchema } from "@snipet/schemas";
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useLocation } from '@/hooks/use-location';
import { useRouter } from '@/hooks/use-router';
import { useToast } from '@/hooks/use-toast';
import { publicRoutes, REDIRECT_WHEN_NOT_AUTHENTICATED_PATH } from '@/routes';
import { can as canPermission } from '@snipet/permission';

import type { Permission } from "@snipet/permission";
type AuthContextType = {
  user: GetSelfUserSchema | undefined;
  currentMember: GetSelfUserSchema["members"][0] | undefined;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  can: (permission: Permission | Permission[]) => boolean;
  canInTenant: (permission: Permission | Permission[], tenantId?: string) => boolean;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [exiting, setExiting] = useState(false);
  const [cookies] = useCookies<"tenant-id", { ["tenant-id"]: string }>(["tenant-id"]);

  const router = useRouter();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const { mutate } = useApiMutation(
    "/api/auth/logout",
    { method: "POST" }
  );
  const { data: user, isLoading: loadingUserSelf, error } = useApiQuery(
    "/api/user/self",
    { method: "GET", retry: false }
  );

  const tenantId = useMemo(() => cookies["tenant-id"], [cookies]);
  const isAuthenticated = !!user;
  const currentMember = user?.members.find((member) => member.tenantId === tenantId);
  const isLoading = loadingUserSelf;

  //#region Permissions
  const tenantPermissions = user?.members.map((member) => ({ tenantId: member.tenantId, role: member.role }));
  const canInTenant = (permission: Permission | Permission[], tenantId: string = cookies["tenant-id"]): boolean => {
    if (tenantPermissions) {
      return canPermission(
        tenantPermissions.find((p) => p.tenantId === tenantId)?.role.permissions ?? [],
        Array.isArray(permission) ? permission : [permission]
      );
    }
    return false;
  }

  const can = (permission: Permission | Permission[]): boolean => canPermission( user?.role.permissions ?? [], permission);
  //#endregion

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

  //#region Effects
  useEffect(() => {
    if (isLoading) return;
    const publicRoute = publicRoutes.find(route => pathname.startsWith(route.path));
    if (!isAuthenticated && publicRoute) {
      return;
    } else if (isAuthenticated && publicRoute && publicRoute.whenAuthenticated === "redirect") {
      router.replace("/");
    } else if (!publicRoute && !isAuthenticated) {
      router.replace(REDIRECT_WHEN_NOT_AUTHENTICATED_PATH);
    } else if (error && error.statusCode === 401 && !exiting) {
      logout();
    }
  }, [isAuthenticated, pathname, router, error, exiting, logout, isLoading]);
  //#endregion

  return (
    <AuthContext.Provider
    value={{
        user,
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
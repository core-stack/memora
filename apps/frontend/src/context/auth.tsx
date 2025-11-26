import { createContext, useCallback, useEffect, useState } from "react";

import { AsyncBoundary } from "@/components/async-boundary";
import { useApiAuthLogout, useApiUserSelf } from "@/gen";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocation } from "@/hooks/use-location";
import { useRouter } from "@/hooks/use-router";
import { useToast } from "@/hooks/use-toast";
import { publicRoutes, REDIRECT_WHEN_NOT_AUTHENTICATED_PATH } from "@/routes";
import { can as canPermission } from "@snipet/permission";
import { useQueryClient } from "@tanstack/react-query";

import type { MemberEntity, UserEntity } from '@/gen';
import type { Permission } from "@snipet/permission";
type AuthContextType = {
  user: UserEntity | undefined;
  currentMember: MemberEntity | undefined;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  can: (permission: Permission | Permission[]) => boolean;
  canInTenant: (permission: Permission | Permission[], tenantId?: string) => boolean;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [exiting, setExiting] = useState(false);
  const [tenantId] = useLocalStorage<string>("tenant-id", null);

  const router = useRouter();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useApiAuthLogout()
  const { data: user, isLoading: loadingUserSelf, error, refetch } = useApiUserSelf({ query: { retry: false } });

  const isAuthenticated = !!user && !error;
  const currentMember = user?.members?.find((member) => member.tenantId === tenantId);
  const isLoading = loadingUserSelf || exiting;

  //#region Permissions
  const tenantPermissions = user?.members?.map((member) => ({ tenantId: member.tenantId, role: member.role }));
  const canInTenant = (
    permission: Permission | Permission[],
    tenant: string | undefined = tenantId ?? undefined
  ): boolean => {
    if (!tenant) throw new Error("tenant is required");
    if (tenantPermissions) {
      return canPermission(
        tenantPermissions.find((p) => p.tenantId === tenant)?.role?.permissions ?? [],
        Array.isArray(permission) ? permission : [permission]
      );
    }
    return false;
  }

  const can = (permission: Permission | Permission[]): boolean => canPermission(user?.role?.permissions ?? [], permission);
  //#endregion

  const logout = useCallback(() => {
    setExiting(true);
    mutate(undefined, {
      onSuccess: async () => {
        queryClient.clear();
        await refetch();
        router.push("/auth/login");
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
  }, [mutate, queryClient, refetch, router, toast]);

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
    } else if (error && error.status === 401 && !exiting) {
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
      <AsyncBoundary isLoading={isLoading}>
        {children}
      </AsyncBoundary>
    </AuthContext.Provider>
  )
}
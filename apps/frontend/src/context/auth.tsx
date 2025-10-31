import type { GetSelfUserSchema, TenantSchema } from "@snipet/schemas";
import { createContext } from 'react';
import { useCookies } from 'react-cookie';

import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useRouter } from '@/hooks/use-router';
import { useToast } from '@/hooks/use-toast';
import { can as canPermission } from '@snipet/permission';

import type { Permission } from "@snipet/permission";
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
  const [cookies] = useCookies<"tenantId", { tenantId: string }>(["tenantId"]);
  const router = useRouter();
  const { toast } = useToast();
  const { mutate } = useApiMutation("/api/auth/logout", { method: "POST" });
  const { data: user, isLoading } = useApiQuery("/api/user/self", { method: "GET" });

  const permissions = user?.members.map((member) => ({
    tenantId: member.tenantId,
    role: member.role,
  }));
  
  const isAuthenticated = !!user;
  const currentMember = user?.members.find((member) => member.tenantId === cookies.tenantId);
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

  const can = (permission: Permission | Permission[]): boolean => canInTenant(cookies.tenantId, permission);

  const logout = () => {
    mutate({}, {
      onSuccess: () => {
        router.replace("/login");
      }, 
      onError: (error) => {
        toast({
          title: "Error logging out",
          description: (error as Error).message,
          variant: "destructive",
        })
      }
    })
  }
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
    >{children}</AuthContext.Provider>
  )
}
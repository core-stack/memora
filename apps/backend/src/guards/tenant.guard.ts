import { AuthRequest } from '@/@types/auth-request';
import { AuthManager } from '@/modules/auth/auth-manager.service';
import { Session } from '@/modules/auth/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { mergePermissions, numberToPermissions } from '@snipet/permission';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly authManager: AuthManager) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();

    let { session } = request;
    if (!session) throw new UnauthorizedException();
    
    if (this.checkTenantAccess(session, request.cookies["tenant-id"])) return true;    
    session = await this.authManager.reloadSession(session.id);
    return this.checkTenantAccess(session, request.cookies["tenant-id"]);
  }

  private checkTenantAccess(session: Session, tenantId?: string): boolean {
    if (!tenantId) {
      if (session.tenants.length > 0) {
        tenantId = session.tenants[0].id;
      } else {
        return false;
      }
    }
    let permissions = numberToPermissions(session.user.permissions);
    
    const tenant = session.tenants.find(w => w.id === tenantId);

    if (tenant) {
      permissions = mergePermissions(permissions, tenant.permissions);
    } else {
      return false;
    }
    return true;
  }
}
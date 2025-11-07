import { AuthRequest } from '@/@types/auth-request';
import { AuthManager } from '@/modules/auth/auth-manager.service';
import { Session } from '@/modules/auth/types';
import { isUUID } from '@/utils/uuid';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly authManager: AuthManager) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();

    let { session } = request;
    if (!session) throw new UnauthorizedException();
    
    if (this.checkTenantAccess(session, request.params.tenantId)) return true;
    session = await this.authManager.reloadSession(session.id);
    return this.checkTenantAccess(session, request.params.tenantId);
  }

  private checkTenantAccess(session: Session, tenantId: string): boolean {
    if (!isUUID(tenantId)) return false;
    const tenant = session.tenants.find(w => w.id === tenantId);
    return !!tenant;
  }
}
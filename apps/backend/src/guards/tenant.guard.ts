import { AuthRequest } from '@/@types/auth-request';
import {
  BadRequestException,
  CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException
} from '@nestjs/common';
import { mergePermissions, numberToPermissions } from '@snipet/permission';

@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();

    const { session } = request;
    if (!session) throw new UnauthorizedException();

    let permissions = numberToPermissions(session.user.permissions);
    let tenantId = request.cookies["tenant-id"];
    if (!tenantId) {
      if (session.tenants.length > 0) {
        tenantId = session.tenants[0].id;
      } else {
        throw new BadRequestException("You don't have access to any tenant");
      }
    }

    const tenant = session.tenants.find(w => w.id === tenantId);

    if (tenant) {
      permissions = mergePermissions(permissions, tenant.permissions);
    } else {
      throw new ForbiddenException("You can`t access this tenant");
    }
    return true;
  }
}
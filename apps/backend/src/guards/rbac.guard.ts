

import { AuthRequest } from '@/@types/auth-request';
import { Permissions } from '@/shared/decorators/role';
import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { can, mergePermissions, numberToPermissions } from '@snipet/permission';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.get(Permissions, context.getHandler());

    const { session } = request;
    if (!session) throw new UnauthorizedException();

    let permissions = numberToPermissions(session.user.permissions);
    const tenantId = request.cookies["tenantId"];
    const tenant = session.tenants.find(w => w.id === tenantId);

    if (tenant) {
      permissions = mergePermissions(permissions, tenant.permissions);
    } else {
      throw new ForbiddenException("You can`t access this tenant");
    }

    if (!can(permissions, requiredPermissions)) {
      throw new ForbiddenException("You don't have permission to access this resource");
    }
    return true;
  }
}
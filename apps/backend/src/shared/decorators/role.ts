import { Reflector } from '@nestjs/core';
import { Permission } from '@snipet/permission';

export const Permissions = Reflector.createDecorator<Permission[]>();
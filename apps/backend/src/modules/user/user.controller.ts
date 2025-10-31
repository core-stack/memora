import { CrudController } from '@/generics';
import { Controller, Get, Req } from '@nestjs/common';
import { userFilterSchema, UserSchema } from '@snipet/schemas';

import { UserService } from './user.service';

import type { Request } from 'express';

@Controller('user')
export class UserController extends CrudController<UserSchema>({ filterSchema: userFilterSchema, ignore: [ 'create', "update", "delete" ] }) {
  constructor(public service: UserService) {
    super(service);
  }

  @Get("self")
  async self(@Req() req: Request) {
    return await this.service.self({ http: this.loadContext(req) });
  }
}

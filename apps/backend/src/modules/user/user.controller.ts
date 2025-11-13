import { Controller, Get, Req } from '@nestjs/common';

import { UserService } from './user.service';

import { BaseController } from '@/shared/controller';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController extends BaseController<UserEntity>({ ignore: [ 'create', "update", "delete" ] }) {
  constructor(public service: UserService) {
    super(service);
  }

  @Get("self")
  async self() {
    return await this.service.self();
  }
}

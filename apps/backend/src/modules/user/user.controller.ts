import { BaseController } from '@/shared/controller';
import { Controller, Get } from '@nestjs/common';

import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';

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

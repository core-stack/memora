import { BaseController } from '@/shared/controller';
import { Get } from '@nestjs/common';

import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { Controller } from '@/shared/decorators/controller';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController extends BaseController({
  entity: UserEntity,
  ignore: [ 'create', "update", "delete" ]
}) {
  constructor(public service: UserService) {
    super(service);
  }

  @Get("self")
  @ApiResponse({ type: UserEntity, status: 200 })
  async self() {
    return await this.service.self();
  }
}

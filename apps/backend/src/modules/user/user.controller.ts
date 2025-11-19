import { BaseController } from '@/shared/controller';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { Controller } from '@/shared/decorators/controller';
import { HttpGet } from '@/shared/controller/decorators';
import { getDefaultFindByIDResponses } from '@/shared/controller/default-response';

@Controller('user')
export class UserController extends BaseController({
 entity: UserEntity,
 ignore: [ 'create', "update", "delete" ]
}) {
  constructor(public service: UserService) {
    super(service);
  }

  @HttpGet("self", { responses: getDefaultFindByIDResponses(UserEntity) })
  async self() {
    return await this.service.self();
  }
}

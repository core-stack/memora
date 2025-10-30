import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { UserSchema, userFilterSchema } from '@snipet/schemas';
import { UserService } from './user.service';

@Controller('user')
export class UserController extends CrudController<UserSchema>(
  userFilterSchema,
  undefined,
  undefined,
  [ 'create', "update", "delete" ]
) {
  constructor(service: UserService) {
    super(service);
  }
}

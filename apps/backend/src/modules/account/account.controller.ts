import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { AccountEntity } from '../../entities/account.entity';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController extends BaseController(AccountEntity) {
  constructor(service: AccountService) {
    super(service);
  }
}

import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { accountFilterSchema, AccountSchema } from '@snipet/schemas';

import { AccountService } from './account.service';

@Controller('account')
export class AccountController extends CrudController<AccountSchema>({ filterSchema: accountFilterSchema }) {
  constructor(service: AccountService) {
    super(service);
  }
}

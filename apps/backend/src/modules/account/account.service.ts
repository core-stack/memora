import { Injectable } from '@nestjs/common';
import { AccountSchema } from '@snipet/schemas';

import { AccountRepository } from './account.repository';
import { CrudService } from '@/generics';
import {  AccountEntity, CreateAccountEntity } from './account.entity';
import { ServiceOptions } from '@/generics/service.interface';

@Injectable()
export class AccountService extends CrudService<
  AccountSchema, Partial<AccountSchema>, Partial<AccountSchema>,
  AccountEntity
> {
  constructor(protected repository: AccountRepository) {
    super(repository);
  }


  async createIfNotExists(data: CreateAccountEntity, opts?: ServiceOptions): Promise<AccountSchema> {
    return this.toSchema(await this.repository.createIfNotExists(data, { tx: opts?.tx }));
  }
}

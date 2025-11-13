import { Service } from '@/shared/service';
import { Injectable } from '@nestjs/common';

import { VerificationTokenEntity } from './verification-token.entity';
import { FilterOptions } from '@/generics/filter-options';
import { EntityManager } from 'typeorm';

@Injectable()
export class VerificationTokenService extends Service<VerificationTokenEntity> {
  entity = VerificationTokenEntity;

  findWithUser(filterOpts: FilterOptions<VerificationTokenEntity>, manager?: EntityManager) {
    return this.repository(manager).find({ ...filterOpts, relations: ['user'] });
  }

  findFirstWithUser(filterOpts: FilterOptions<VerificationTokenEntity>, manager?: EntityManager) {
    return this.repository(manager).findOne({ ...filterOpts, relations: ['user'] });
  }
}

import { Injectable } from '@nestjs/common';

import { VerificationTokenRepository } from './verification-token.repository';
import { CrudService } from '@/generics';
import { CreateVerificationTokenEntity, UpdateVerificationTokenEntity, VerificationTokenEntity } from './verification-token.entity';
import { ServiceOptions } from '@/generics/service.interface';
import { FilterOptions } from '@/generics/filter-options';

@Injectable()
export class VerificationTokenService extends CrudService<
  VerificationTokenEntity, CreateVerificationTokenEntity, UpdateVerificationTokenEntity,
  VerificationTokenEntity, CreateVerificationTokenEntity, UpdateVerificationTokenEntity
> {
  constructor(protected repository: VerificationTokenRepository) {
    super(repository);
  }

  findUniqueWithUser(filterOpts: FilterOptions<VerificationTokenEntity>, opts?: ServiceOptions) {
    return this.repository.findUniqueWithUser(filterOpts, { tx: opts?.tx });
  }
}

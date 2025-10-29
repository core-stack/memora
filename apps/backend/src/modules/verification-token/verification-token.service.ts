import { Injectable } from '@nestjs/common';

import { VerificationTokenRepository } from './verification-token.repository';
import { CrudService } from '@/generics';
import { CreateVerificationTokenEntity, UpdateVerificationTokenEntity, VerificationTokenEntity } from './verification-token.entity';

@Injectable()
export class VerificationTokenService extends CrudService<
  VerificationTokenEntity, CreateVerificationTokenEntity, UpdateVerificationTokenEntity,
  VerificationTokenEntity, CreateVerificationTokenEntity, UpdateVerificationTokenEntity
> {
  constructor(repository: VerificationTokenRepository) {
    super(repository);
  }
}

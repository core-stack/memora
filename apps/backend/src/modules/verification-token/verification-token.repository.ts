import { DrizzleGenericRepository } from '@/generics';
import { CreateVerificationTokenEntity, UpdateVerificationTokenEntity, VerificationTokenEntity } from './verification-token.entity';
import { verificationToken } from '@/db/schema';

export class VerificationTokenRepository extends DrizzleGenericRepository<
  typeof verificationToken,
  VerificationTokenEntity,
  CreateVerificationTokenEntity,
  UpdateVerificationTokenEntity
> {
  constructor() {
    super(verificationToken, "token");
  }
}
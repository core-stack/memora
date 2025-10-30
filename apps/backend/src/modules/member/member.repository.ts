import { DrizzleGenericRepository } from '@/generics';
import { MemberEntity } from './member.entity';
import { member } from '@/db/schema/member';

export class MemberRepository extends DrizzleGenericRepository<
  typeof member, MemberEntity
> {
  constructor() {
    super(member);
  }
}
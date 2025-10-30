import { Injectable } from '@nestjs/common';
import { MemberSchema } from '@snipet/schemas';

import { MemberRepository } from './member.repository';
import { CrudService } from '@/generics';
import {  MemberEntity } from './member.entity';

@Injectable()
export class MemberService extends CrudService<
  MemberSchema, Partial<MemberSchema>, Partial<MemberSchema>,
  MemberEntity
> {
  constructor(repository: MemberRepository) {
    super(repository);
  }
}

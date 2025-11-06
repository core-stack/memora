import { CrudService } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';
import { Injectable } from '@nestjs/common';
import { MemberSchema } from '@snipet/schemas';

import { MemberEntity } from './member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService extends CrudService<
  MemberSchema, Partial<MemberSchema>, Partial<MemberSchema>,
  MemberEntity
> {
  constructor(repository: MemberRepository) {
    super(repository);
  }

  override async find(filterOpts: FilterOptions<MemberEntity>, opts?: ServiceOptions): Promise<MemberEntity[]> {
    let res = await this.repository.find(filterOpts, { tx: opts?.tx });
    return res.map(member => {
      delete member.user?.password;
      return member;
    });
  }
}

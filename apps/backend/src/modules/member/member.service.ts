import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';
import { Injectable, Logger } from '@nestjs/common';
import { MemberSchema } from '@snipet/schemas';

import { MemberEntity } from './member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService extends GenericTenantService<
  MemberSchema, Partial<MemberSchema>, Partial<MemberSchema>,
  MemberEntity
> {
  logger = new Logger(MemberService.name);
  constructor(protected repository: MemberRepository) {
    super(repository);
  }

  override async find(filterOpts: FilterOptions<MemberEntity>, opts?: ServiceOptions): Promise<MemberEntity[]> {
    let res = await this.repository.find(filterOpts, { tx: opts?.tx });
    return res.map(member => {
      delete member.user?.password;
      return member;
    });
  }

  async findByUserEmail(email: string, opts?: ServiceOptions): Promise<MemberEntity | null>
  async findByUserEmail(email: string[], opts?: ServiceOptions): Promise<MemberEntity[] | null>
  async findByUserEmail(
    email: string | string[],
    opts?: ServiceOptions
  ): Promise<MemberEntity | MemberEntity[] | null> {
    return this.repository.findByUserEmail(email, { tx: opts?.tx });
  }
}

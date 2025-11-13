import { Injectable, Logger } from '@nestjs/common';

import { MemberEntity } from './member.entity';
import { Service } from '@/shared/service';
import { EntityManager, In } from 'typeorm';

@Injectable()
export class MemberService extends Service<MemberEntity> {
  entity = MemberEntity;
  logger = new Logger(MemberService.name);

  async findByUserEmail(email: string, manager?: EntityManager): Promise<MemberEntity | null>
  async findByUserEmail(email: string[], manager?: EntityManager): Promise<MemberEntity[] | null>
  async findByUserEmail(
    email: string | string[],
    manager?: EntityManager
  ): Promise<MemberEntity | MemberEntity[] | null> {
    return this.repository(manager).find({
      where: { user: { email: Array.isArray(email) ? In(email) : email } }
    });
  }
}

import { EntityManager, In } from "typeorm";

import { Service } from "@/shared/service";
import { Injectable, Logger } from "@nestjs/common";

import { MemberEntity } from "../../entities/member.entity";

@Injectable()
export class MemberService extends Service<MemberEntity> {
  entity = MemberEntity;
  logger = new Logger(MemberService.name);

  async findByUserEmail(tenantId: string, email: string, manager?: EntityManager): Promise<MemberEntity | null>
  async findByUserEmail(tenantId: string, email: string[], manager?: EntityManager): Promise<MemberEntity[]>
  async findByUserEmail(
    tenantId: string,
    email: string | string[],
    manager?: EntityManager
  ): Promise<MemberEntity | MemberEntity[] | null> {
    return this.repository(manager).find({
      where: { user: { email: Array.isArray(email) ? In(email) : email }, tenantId }
    });
  }
}

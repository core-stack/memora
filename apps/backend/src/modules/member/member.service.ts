import { EntityManager, FindManyOptions, In } from "typeorm";

import { Service } from "@/shared/service";
import { Injectable, Logger } from "@nestjs/common";

import { MemberEntity } from "../../entities/member.entity";

@Injectable()
export class MemberService extends Service<MemberEntity> {
  entity = MemberEntity;
  logger = new Logger(MemberService.name);

  async findByUserEmail(
    tenantId: string,
    email: string,
    filter?: Omit<FindManyOptions<MemberEntity>, "where">,
    manager?: EntityManager
  ): Promise<MemberEntity | null>
  async findByUserEmail(
    tenantId: string,
    email: string[],
    filter?: Omit<FindManyOptions<MemberEntity>, "where">,
    manager?: EntityManager
  ): Promise<MemberEntity[]>
  async findByUserEmail(
    tenantId: string,
    email: string | string[],
    filter?: Omit<FindManyOptions<MemberEntity>, "where">,
    manager?: EntityManager
  ): Promise<MemberEntity | MemberEntity[] | null> {
    const res = await this.repository(manager).find({
      ...filter,
      where: { user: { email: Array.isArray(email) ? In(email) : email }, tenantId }
    });

    return Array.isArray(email) ? res : res[0];
  }
}

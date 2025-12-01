import { EntityManager } from "typeorm";

import { Service } from "@/shared/service";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { permissionsToNumber, ROLES } from "@snipet/permission";

import { MemberEntity } from "../../entities/member.entity";
import { RoleEntity, RoleScope } from "../../entities/role.entity";
import { TenantEntity } from "../../entities/tenant.entity";
import { AuthManager } from "../auth/auth-manager.service";
import { MemberService } from "../member/member.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { LLMService } from "../llm/llm.service";
import { LLMType } from "@/entities";
import { env } from "@/env";

@Injectable()
export class TenantService extends Service<TenantEntity> {
  entity = TenantEntity;
  logger = new Logger(TenantService.name);

  @Inject() private readonly authManager: AuthManager;
  @Inject() private readonly memberService: MemberService;
  @Inject() private readonly llmService: LLMService;

  override async create(input: CreateTenantDto, manager?: EntityManager): Promise<TenantEntity> {
    return this.transaction(async (manager) => {
      const userId = input.userId ?? this.context.user?.id;
      if (!userId) throw new BadRequestException("User not found");
      const tenant = await this.repository(manager).save({
        name: input.name,
        description: input.description,
        backgroundImage: input.backgroundImage
      });

      //#region create roles
      const roles = await manager.getRepository(RoleEntity).save(ROLES.tenant.default.map((r) =>
        new RoleEntity({
          key: r.key,
          name: r.name,
          permissions: permissionsToNumber(r.permissions),
          scope: RoleScope.TENANT,
          tenantId: tenant.id
        })
      ));
      const adminRole = roles.find(r => r.key === ROLES.tenant.admin.key);
      if (!adminRole) throw new Error("Admin role not found");
      const member = await manager.getRepository(MemberEntity).save(
        new MemberEntity({
          roleId: adminRole.id,
          owner: true,
          tenantId: tenant.id,
          userId
        })
      );
      //#endregion

      //#region create llm
      await this.llmService.create({
        type: LLMType.EMBEDDING,
        model: env.LLM_EMBEDDING_DEFAULT_SETTINGS.model,
        key: env.LLM_EMBEDDING_DEFAULT_SETTINGS.key,
        name: env.LLM_EMBEDDING_DEFAULT_SETTINGS.name,
        tenantId: tenant.id,
        default: true,
        config: env.LLM_EMBEDDING_DEFAULT_SETTINGS
      }, manager);

      await this.llmService.create({
        type: LLMType.TEXT,
        model: env.LLM_TEXT_DEFAULT_SETTINGS.model,
        key: env.LLM_TEXT_DEFAULT_SETTINGS.key,
        name: env.LLM_TEXT_DEFAULT_SETTINGS.name,
        tenantId: tenant.id,
        default: true,
        config: env.LLM_TEXT_DEFAULT_SETTINGS
      }, manager);

      //#endregion
      // member
      await this.memberService.create(member, manager);
      if (this.context.session?.id) await this.authManager.reloadSession(this.context.session.id);
      return tenant;
    }, manager);
  }
}

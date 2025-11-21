
import { BaseController } from "@/shared/controller";
import { Controller } from "@/shared/controller/decorators";

import { MemberEntity } from "../../entities/member.entity";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { MemberService } from "./member.service";

@Controller("tenant/:tenantId/member")
export class MemberController extends BaseController({
  entity: MemberEntity,
  updateDto: UpdateMemberDto,
  ignore: [ "create" ],
  allowedFilters: [ "tenantId" ],
  allowedRelations: [ "user", "role", "tenant" ]
}) {
  constructor(service: MemberService) {
    super(service);
  }
}

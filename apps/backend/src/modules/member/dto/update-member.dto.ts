import { PartialType, PickType } from '@nestjs/swagger';

import { MemberEntity } from '@/entities';

export class UpdateMemberDto extends PartialType(
  PickType(MemberEntity, ['roleId'] as const),
) {}

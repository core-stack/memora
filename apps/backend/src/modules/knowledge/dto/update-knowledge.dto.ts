import { PartialType, PickType } from '@nestjs/swagger';

import { KnowledgeEntity } from '@/entities';

export class UpdateKnowledgeDto extends PartialType(
  PickType(KnowledgeEntity, ['title', 'description'] as const),
) {}

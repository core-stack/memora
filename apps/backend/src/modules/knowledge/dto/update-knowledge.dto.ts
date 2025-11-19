import { KnowledgeEntity } from '@/entities';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateKnowledgeDto extends PartialType(
  PickType(KnowledgeEntity, ['title', 'description'] as const),
) {}

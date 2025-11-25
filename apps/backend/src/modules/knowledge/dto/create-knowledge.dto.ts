import { KnowledgeEntity } from '@/entities';
import { TenantId } from '@/shared/controller/decorators';
import { PickType } from '@nestjs/swagger';

export class CreateKnowledgeDto extends PickType(KnowledgeEntity, [
  "slug",
  "title",
  "description"
] as const) {
  @TenantId()
  tenantId: string;
}

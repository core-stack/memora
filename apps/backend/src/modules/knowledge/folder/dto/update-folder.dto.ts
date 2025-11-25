import { FolderEntity } from '@/entities';
import { KnowledgeId, TenantId } from '@/shared/controller/decorators';
import { PickType } from '@nestjs/swagger';

export class UpdateFolderDto extends PickType(FolderEntity, [ "name" ]) {
  @KnowledgeId()
  knowledgeId: string;

  @TenantId()
  tenantId: string;
}

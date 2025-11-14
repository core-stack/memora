import { TenantGuard } from '@/guards/tenant.guard';
import { BaseController } from '@/shared/controller';
import { Controller, UseGuards } from '@nestjs/common';

import { KnowledgeEntity } from './knowledge.entity';
import { KnowledgeService } from './knowledge.service';

@UseGuards(TenantGuard)
@Controller('tenant/:tenantId/knowledge')
export class KnowledgeController extends BaseController<KnowledgeEntity>() {

  constructor(service: KnowledgeService) {
    super(service);
  }
}

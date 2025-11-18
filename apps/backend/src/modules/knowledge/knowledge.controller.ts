import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { TenantGuard } from '@/guards/tenant.guard';
import { BaseController } from '@/shared/controller';
import { Controller, UseGuards } from '@nestjs/common';

import { KnowledgeEntity } from '../../entities/knowledge.entity';
import { KnowledgeService } from './knowledge.service';

@UseGuards(TenantGuard)
@Controller('tenant/:tenantId/knowledge')
export class KnowledgeController extends BaseController({
  entity: KnowledgeEntity,
  createDto: CreateKnowledgeDto,
  updateDto: UpdateKnowledgeDto,
}) {
  constructor(service: KnowledgeService) {
    super(service);
  }
}

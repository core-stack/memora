import { LLMEntity } from '@/entities/llm.entity';
import { BaseController } from '@/shared/controller';
import { Controller, Get } from '@nestjs/common';

import { LLMService } from './llm.service';

@Controller('tenant/:tenantId/llm')
export class LLMController extends BaseController(LLMEntity) {
  constructor(public service: LLMService) {
    super(service);
  }

  @Get('presets')
  getPresets() {
    return this.service.manager.getPresets();
  }
}

import { Controller, Get } from '@nestjs/common';
import { LLMService } from './llm.service';
import { BaseController } from '@/shared/controller';
import { LLMEntity } from './llm.entity';

@Controller('tenant/:tenantId/llm')
export class LLMController extends BaseController<LLMEntity>() {
  constructor(public service: LLMService) {
    super(service);
  }

  @Get('presets')
  getPresets() {
    return this.service.getPresets();
  }
}

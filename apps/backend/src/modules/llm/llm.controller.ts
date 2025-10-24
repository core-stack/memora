import { CrudController } from '@/generics';
import { Controller, Get } from '@nestjs/common';
import { createLLMSchema, LLM, llmFilterSchema, updateLLMSchema } from '@snipet/schemas';

import { LLMService } from './llm.service';

@Controller('llm')
export class LLMController extends CrudController<LLM> {
  constructor(protected service: LLMService) {
    super(service, llmFilterSchema, createLLMSchema, updateLLMSchema);
  }

  @Get('presets')
  getPresets() {
    return this.service.getPresets();
  }
}

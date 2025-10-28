import { CrudController } from '@/generics';
import { Controller, Get } from '@nestjs/common';
import { createLLMSchema, LLM, llmFilterSchema, updateLLMSchema } from '@snipet/schemas';

import { LLMService } from './llm.service';

@Controller('llm')
export class LLMController extends CrudController<LLM>(llmFilterSchema, createLLMSchema, updateLLMSchema) {
  constructor(public service: LLMService) {
    super(service);
  }

  @Get('presets')
  getPresets() {
    return this.service.getPresets();
  }
}

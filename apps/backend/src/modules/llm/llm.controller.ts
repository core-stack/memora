import { CrudController } from '@/generics';
import { Controller, Get } from '@nestjs/common';
import { createLLMSchema, LLM, llmFilterSchema, updateLLMSchema } from '@snipet/schemas';

import { LLMService } from './llm.service';

@Controller('tenant/:tenantId/llm')
export class LLMController extends CrudController<LLM>(
  { filterSchema: llmFilterSchema, createDtoSchema: createLLMSchema, updateDtoSchema: updateLLMSchema }
) {
  constructor(public service: LLMService) {
    super(service);
  }

  @Get('presets')
  getPresets() {
    return this.service.getPresets();
  }
}

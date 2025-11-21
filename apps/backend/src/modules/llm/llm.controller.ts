import { LLMEntity } from "@/entities/llm.entity";
import { BaseController } from "@/shared/controller";
import { Controller, HttpGet } from "@/shared/controller/decorators";
import { LLMPreset } from "@/types/llm-preset";
import { ApiResponse } from "@nestjs/swagger";

import { LLMService } from "./llm.service";

@Controller("tenant/:tenantId/llm")
export class LLMController extends BaseController({ entity: LLMEntity }) {
  constructor(public service: LLMService) {
    super(service);
  }

  @HttpGet("presets")
  @ApiResponse({ status: 200, type: LLMPreset, isArray: true })
  getPresets() {
    return this.service.manager.getPresets();
  }
}

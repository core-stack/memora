import { Module } from "@nestjs/common";

import { LLMLoaderService } from "./llm-loader.service";
import { LLMManagerService } from "./llm-manager.service";

@Module({
  providers: [ LLMManagerService, LLMLoaderService ],
  exports: [ LLMManagerService ]
})
export class LLMManagerModule {}

import { Module } from "@nestjs/common";

import { LLMLoaderService } from "./llm-loader.service";
import { LLMManagerService } from "./llm-manager.service";
import { SecurityModule } from "../security/security.module";

@Module({
  providers: [ LLMManagerService, LLMLoaderService ],
  exports: [ LLMManagerService ],
  imports: [ SecurityModule ]
})
export class LLMManagerModule {}

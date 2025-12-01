import { DatabaseModule } from "@/infra/database/database.module";
import { LLMManagerModule } from "@/infra/llm-manager/llm-manager.module";
import { SecurityModule } from "@/infra/security/security.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { forwardRef, Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge/knowledge.module";
import { LLMController } from "./llm.controller";
import { LLMService } from "./llm.service";

@Module({
  controllers: [ LLMController ],
  providers: [ LLMService ],
  imports: [
    DatabaseModule,
    SecurityModule,
    HTTPContextModule,
    forwardRef(() => KnowledgeModule),
    LLMManagerModule
  ],
  exports: [ LLMService ]
})
export class LLMModule {}

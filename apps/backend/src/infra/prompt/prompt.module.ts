import { env } from "@/env";
import { Module } from "@nestjs/common";

import { TEMPLATES_DIR } from "./config";
import { PromptService } from "./prompt.service";

@Module({
  providers: [
    PromptService,
    {
      provide: TEMPLATES_DIR,
      useValue: env.PROMPT_TEMPLATES_DIR
    }
  ],
  exports: [ PromptService ]
})
export class PromptModule {}

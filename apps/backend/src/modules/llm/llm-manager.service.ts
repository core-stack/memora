import { Injectable } from '@nestjs/common';

import { LLMEntity } from './llm.schema';

@Injectable()
export class LLMManagerService {

  async preloadLLM(llm: LLMEntity | LLMEntity[]) {
    const llms = Array.isArray(llm) ? llm : [llm];
  }

  getLLM(id: string) {

  }
}
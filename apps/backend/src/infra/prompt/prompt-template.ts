import '@/lib/handlebars-helpers';

import Handlebars from 'handlebars';

import { env } from '@/env';
import { Logger } from '@nestjs/common';

export class PromptTemplate<T = any> {
  private readonly logger = new Logger(PromptTemplate.name);
  constructor(private template: string, private data?: T) { }

  build(data?: T): string {
    if (!this.data && !data) return this.template;
    if (!data) data = this.data;
    const template = Handlebars.compile(this.template);
    const res = template(data);
    if (env.DEBUG_PROMPTS) this.logger.debug(res);
    return res;
  }
}

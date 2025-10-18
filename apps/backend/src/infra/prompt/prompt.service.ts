import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { join } from 'path';

import { env } from '@/env';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PromptTemplate } from './prompt-template';

@Injectable()
export class PromptService implements OnModuleInit {
  private readonly logger = new Logger(PromptService.name);

  private templatesDir = env.PROMPT_TEMPLATES_DIR;

  private templates = new Map<string, PromptTemplate<any>>();

  constructor() {}

  async onModuleInit(): Promise<void> {
    const files = await readdir(this.templatesDir);
    this.logger.log(`Found ${files.length} templates in ${this.templatesDir}`);

    for (const file of files) {
      try {
        this.logger.log(`Loading prompt template: ${file}`);
        const { content } = matter(await readFile(join(this.templatesDir, file), 'utf-8'));
        const name = file.replace(/\..+$/, '');
        this.templates.set(name, new PromptTemplate(content));
      } catch (error) {
        this.logger.error(`Failed to load prompt template: ${file}`, error);
      }
    }

    this.logger.log(`Prompt instances generated!`);
  }

  // @ts-ignore
  getTemplate<K extends keyof typeof import('@generated/prompts/prompts').PromptTemplates>(
    name: K
  ): (typeof import('@generated/prompts/prompts').PromptTemplates)[K] {
    // @ts-ignore
    return require('@generated/prompts/prompts').PromptTemplates[name];
  }
}

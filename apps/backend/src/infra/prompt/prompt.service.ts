import { readdir, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { join, resolve } from 'path';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PromptTemplate } from './prompt-template';

export const TEMPLATES_DIR = resolve(process.cwd(), 'src/infra/prompt/prompts');

@Injectable()
export class PromptService implements OnModuleInit {
  private readonly logger = new Logger(PromptService.name);

  private templatesDir = TEMPLATES_DIR;

  private templates = new Map<string, PromptTemplate<any>>();

  constructor() {}

  async onModuleInit(): Promise<void> {
    const files = await readdir(this.templatesDir);
    this.logger.log(`Found ${files.length} templates in ${this.templatesDir}`);

    const decls: string[] = [];
    const exports: string[] = [];

    decls.push(
      `// Generated file - do not edit\n` +
      `import { PromptTemplate } from './prompt-template';\n\n`
    );

    for (const file of files) {
      try {
        this.logger.log(`Loading prompt template: ${file}`);
        const content = await readFile(join(this.templatesDir, file), 'utf-8');
        const { data, content: template } = matter(content);

        const name = file.replace(/\..+$/, '');
        const interfaceName = this.camelToPascal(name) + 'Vars';
        const vars = Object.entries(data.vars || {})
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n');

        decls.push(`export interface ${interfaceName} {\n${vars}\n}\n`);

        decls.push(
          `export const ${this.camelToPascal(name)} = new PromptTemplate<${interfaceName}>(\n` +
          '  ' + JSON.stringify(template) + '\n);\n'
        );

        exports.push(this.camelToPascal(name));

        this.templates.set(name, new PromptTemplate(template));
      } catch (error) {
        this.logger.error(`Failed to load prompt template: ${file}`, error);
      }
    }

    decls.push(`\nexport const PromptTemplates = { ${exports.join(', ')} } as const;\n`);

    const outputPath = resolve('./src/infra/prompt/prompts.ts');
    await writeFile(outputPath, decls.join('\n'), { encoding: 'utf-8' });

    this.logger.log(`Prompt types and instances generated at: ${outputPath}`);
  }

  // @ts-ignore
  getTemplate<K extends keyof typeof import('./prompts').PromptTemplates>(name: K): (typeof import('./prompts').PromptTemplates)[K] { 
    // @ts-ignore
    return require('./prompts').PromptTemplates[name];
  }

  private camelToPascal(str: string): string {
    return str
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // improve-query -> improveQuery
      .replace(/^(.)/, (_, c) => c.toUpperCase()); // improveQuery -> ImproveQuery
  }
}

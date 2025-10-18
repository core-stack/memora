const { readdir, readFile, writeFile, mkdir } = require('fs/promises');
const matter = require('gray-matter');
const path = require('path');

const dir = path.resolve(process.cwd());
const targetPath = path.join(dir, "src", '@generated/prompts');

const camelToPascal = (str) => {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // improve-query -> improveQuery
    .replace(/^(.)/, (_, c) => c.toUpperCase()); // improveQuery -> ImproveQuery
}

const stringifyVars = (obj, indent = 0) => {
  const pad = ' '.repeat(indent);
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'string') return `${pad}${key}: ${value};`;
      if (Array.isArray(value)) {
        if (value.length === 0) return `${pad}${key}: any[];`;
        const first = value[0];
        if (typeof first === 'string') return `${pad}${key}: ${first}[];`;
        if (typeof first === 'object') {
          return `${pad}${key}: {\n${stringifyVars(first, indent + 2)}\n${pad}}[];`;
        }
      }
      if (typeof value === 'object') {
        return `${pad}${key}: {\n${stringifyVars(value, indent + 2)}\n${pad}};`;
      }
      return `${pad}${key}: any;`;
    })
    .join('\n');
}

const main = async (templatesDir = `${dir}/prompts`) =>  {
  const files = await readdir(templatesDir);
  console.log(`Found ${files.length} templates in ${templatesDir}`);

  const decls = [];
  const exports = [];

  decls.push(
    `// Generated file - do not edit\n` +
    `import { PromptTemplate } from '@/infra/prompt/prompt-template';\n\n`
  );

  for (const file of files) {
    try {
      console.log(`Loading prompt template: ${file}`);
      const content = await readFile(path.join(templatesDir, file), 'utf-8');
      const { data, content: template } = matter(content);

      const name = file.replace(/\..+$/, '');
      const interfaceName = camelToPascal(name) + 'Vars'

      const vars = stringifyVars(data.vars || {}, 2);

      decls.push(`export interface ${interfaceName} {\n${vars}\n}\n`);

      decls.push(
        `export const ${camelToPascal(name)} = new PromptTemplate<${interfaceName}>(\n` +
        '  ' + JSON.stringify(template) + '\n);\n'
      );

      exports.push(camelToPascal(name));
    } catch (error) {
      console.error(`Failed to load prompt template: ${file}`, error);
    }
  }

  decls.push(`\nexport const PromptTemplates = { ${exports.join(', ')} } as const;\n`);

  await mkdir(targetPath, { recursive: true });

  await writeFile(path.join(targetPath, 'prompts.ts'), decls.join('\n'), { encoding: 'utf-8' });

  console.log(`Prompt types generated!`);
}

main(process.argv[2]);
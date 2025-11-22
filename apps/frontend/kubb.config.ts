import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

function extractPrefix(str: string): string {
  if (!/^[A-Z]/.test(str)) return "";
  const match = str.match(/^[A-Z]+/);
  return match ? match[0] : "";
}

function lowercasePrefix(str: string): string {
  const prefix = extractPrefix(str);
  if (!prefix) return str;

  const lower = prefix.toLowerCase();
  return lower + str.slice(prefix.length);
}

const nameTransformer = (name: string) => {
  return name
    .replace(/^use/, 'useApi')
    .replace('Controller', "")
    .replace('FindByID', "ByID")
    .replace('FindMany', "");
}

export default defineConfig(() => {
  return {
    root: '.',
    input: { path: '../backend/swagger.yaml' },
    output: { path: './src/gen' },
    plugins: [
      pluginOas(),
      pluginTs({
        output: { path: "./types" },
        transformers: { name: nameTransformer }
      }),
      pluginReactQuery({
        output: { path: "./hooks" },
        client: { baseURL: "/" },
        transformers: { 
          name: (name, type) => {
            name = nameTransformer(name);
            if (type === "const" && name.endsWith("QueryKey")) return `${name}Fn`;
            return name;
          }
        },
        parser: 'zod',
        paramsType: 'object',
        pathParamsType: 'object',
      }),
      pluginZod({
        output: { path: "./zod" },
        inferred: true,
        transformers: {
          name: (name, type) => {
            name = nameTransformer(name);
            if (type === "function") {
              return lowercasePrefix(name);
            }

            return name;
          }
        }
      })
    ],
  }
})
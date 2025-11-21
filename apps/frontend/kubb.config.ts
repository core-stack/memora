import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

const nameTransformer = (name: string, type?: "function" | "type" | "const" | "file") => {
  const base = name
    .replace(/^use/, 'useApi')
    .replace('Controller', "")
    .replace('FindByID', "ByID")
    .replace('FindMany', "");

  // Se for usado para QueryKeys, o Kubb tenta gerar:
  //   `${name}QueryKey`
  // Então o tipo vira `${name}QueryKey` também.
  // Vamos prevenir isso alterando apenas nomes de funções.

  if (type === "const" && base.endsWith("QueryKey")) {
    return `${base}Fn`;
  }

  return base;
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
        transformers: { name: nameTransformer },
        parser: 'zod',
      }),
      pluginZod({
        output: { path: "./zod" },
        inferred: true,
        transformers: { name: nameTransformer }
      })
    ],
  }
})
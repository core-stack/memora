import { defineConfig } from '@kubb/core'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
export default defineConfig(() => {
  return {
    root: '.',
    input: {
      path: '../backend/swagger.yaml',
    },
    output: {
      path: './src/gen',
    },
    plugins: [
      pluginOas(),
      pluginTs(),
      pluginReactQuery({
        output: {
          path: "./hooks"
        }
      })
    ],
  }
})
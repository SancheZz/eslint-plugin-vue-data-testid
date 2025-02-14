import { add, unique } from './src/rules/index.ts'
import { PluginOptions } from './src/types.ts'
import packagejson from './package.json' with { type: 'json' }

export default function createPlugin (options: PluginOptions) {
  const rules = {
    add: add(options),
    unique,
  }

  const plugin = {
    meta: {
      name: '@yasanchezz/eslint-plugin-vue-data-testid',
      version: packagejson.version
    },
    rules,
    configs: {
      get recommended () {
        return recommended
      }
    },
  }

  const recommended = [{
    plugins: {
      'vue-data-testid': plugin,
    },
    rules: {
      'vue-data-testid/add': 'error',
      'vue-data-testid/unique': 'warn',
    }
  }]

  return plugin
}

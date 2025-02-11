import { add } from './src/rules/index.ts'
import { PluginOptions } from './src/types.ts'
import packagejson from './package.json' with { type: 'json' }

export default function createPlugin (options: PluginOptions) {
  const rules = {
    add: add(options),
  }

  const plugin = {
    meta: {
      name: '@yasanchezz/eslint-plugin-vue-data-testid',
      version: packagejson.version
    },
    rules,
    configs: {},
    processors: {},
  }

  Object.assign(plugin.configs, {
    recommended: [{
      plugins: {
        'vue-data-testid': plugin,
      },
      rules: {
        'vue-data-testid/add': 'error'
      }
    }],
  })

  return plugin
}

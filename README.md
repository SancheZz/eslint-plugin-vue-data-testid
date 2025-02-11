# @yasanchezz/eslint-plugin-vue-data-testid

An `eslint` plugin for checking accessibility rules from within `.vue` files. Add `data-testid` to use better behavior testing

## 💻 Installation

### install dependency

`pnpm add -D @yasanchezz/eslint-plugin-vue-data-testid`

### describe dependency inside eslint config

```javascript
import vueDataTestid from '@yasanchezz/eslint-plugin-vue-data-testid'

// e.g. convert filename and BEM class into data-testid
function buildDataTestid(options) {
  const filename = options.filename.replace('.vue', '')
  const [first, second] = [options.className.at(0), options.className.slice(1)]

  // convert BEM class name to data-testid
  const classId = first?.toUpperCase() + second
    .replace(/-[a-z]/g, (input) => input.at(1).toUpperCase())
    .replace(/(?<=__)[a-z]/g, (input) => input.toUpperCase())

  return classId
    ? `${filename}__${classId}`
    : filename
}

// e.g. check node to ignore it
function ignoreNode(nodeName) {
  return /([A-Z]).*([A-Z])/.test(nodeName) || nodeName.includes('-')
}

// use inside eslint flat configs
export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  
  ...vueDataTestid({
    buildDataTestid,
    ignoreNode,
  }).configs.recommended
]
```

# @yasanchezz/eslint-plugin-vue-data-testid

An `eslint` plugin for checking accessibility rules from within `.vue` files. Add `data-testid` to use better behavior testing

## 💻 Installation

Plugin requires `eslint@9`.

### install dependency

`pnpm add -D @yasanchezz/eslint-plugin-vue-data-testid`

### describe dependency inside eslint config

```typescript
import vueDataTestid from '@yasanchezz/eslint-plugin-vue-data-testid'

// options type
type Options = {
  nodeName: string;
  filepath: string;
  filename: string;
  isRoot: boolean;
  className?: string;
  classNames?: string[];
}

// e.g. convert filename and BEM class into data-testid
function buildDataTestid(options: Options) {
  const filename = options.filename.replace('.vue', '')
  const [first, second] = [options.className?.at(0), options.className?.slice(1)]

  // convert BEM class name to data-testid
  const classId = first && second
    ? first.toUpperCase() + second
      .replace(/-[a-z]/g, (input) => input.at(1).toUpperCase())
      .replace(/(?<=__)[a-z]/g, (input) => input.toUpperCase())
    : undefined

  return classId
    ? `${filename}__${classId}`
    : filename
}

// e.g. check node to ignore it
function ignoreNode(options: Options) {
  return /([A-Z]).*([A-Z])/.test(options.nodeName) || options.nodeName.includes('-')
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

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

// undefined value does not trigger valiation rule
// string value enforces eslint rule behavior
type ReturnValueTestId = string | undefined

// e.g. convert filename and BEM class into data-testid
function buildDataTestid(options: Options): ReturnValueTestId {
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
    attributeName: 'data-testid', // default data-testid (optional props)
    buildDataTestid, // convert AST attributes to data-testid
    ignoreNode, // check ignored nodes
  }).configs.recommended
]
```

### Rules
- `vue-data-testid/add` - if data-testid is missing, it should be added
- `vue-data-testid/unique` - attribute should be unique

### example converted node
before
```vue
<div class="hello-world"></div>
```

after
```vue
<div
  data-testid="App__HelloWorld"
  class="hello-world"
></div>
```

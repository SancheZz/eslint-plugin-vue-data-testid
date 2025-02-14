import * as path from 'node:path'
import { Rule } from 'eslint'
import { AST } from 'vue-eslint-parser'

const searchedAttributeNames = new Set(['data-testid', 'dataTestid'])
const fileAttributeNames = new Map<string, Set<string>>()

const rule: Rule.RuleModule = {
  meta: {
    docs: { description: 'data-testid attribute should be unique' },
    type: 'suggestion',
    fixable: 'code',
    schema: [], // no options
  },
  create (context) {
    // const filename = path.basename(context.filename)
    const extname = path.extname(context.filename)

    if (extname !== '.vue') {
      return {}
    }

    const attributeNames = fileAttributeNames.get(context.filename) ?? new Set()
    fileAttributeNames.set(context.filename, attributeNames)
    attributeNames.clear()

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node: AST.VAttribute | AST.VDirective) {
        const name = node.key.type === 'VDirectiveKey'
          ? node.key.name.name
          : node.key.name

        const value = node.value?.type === 'VLiteral'
          ? node.value.value
          : undefined

        const attributes = Iterator.from(fileAttributeNames)
          .reduce((result, [, set]) => result.union(set), new Set())

        if (searchedAttributeNames.has(name) && value && attributes.has(value)) {
          const filename = Iterator.from(fileAttributeNames)
            .filter(([, set]) => set.has(value))
            .map(([filepath]) => path.basename(filepath))
            .toArray()
            .at(0)

          context.report({
            node: node as any,
            message: 'should make data-testid unique. {{attribute}} has already defined in the file {{filename}}',
            data: {
              attribute: value,
              filename: filename ?? ''
            }
          })
        }

        if (searchedAttributeNames.has(name) && value) {
          attributeNames.add(value)
        }

        return {}
      }
    })
  }
}

export default rule

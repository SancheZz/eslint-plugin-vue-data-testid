import type { Rule } from 'eslint'
import * as path from 'node:path'
import { AST } from 'vue-eslint-parser'
import { PluginOptions } from '../types'
import { calculateAttributeNames } from '../utils/index.ts'

const fileAttributeNames = new Map<string, Set<string>>()

export default function createRule ({
  attributeName = 'data-testid',
}: PluginOptions): Rule.RuleModule {
  const searchedAttributeNames = calculateAttributeNames(attributeName)

  return {
    meta: {
      docs: { description: 'data-testid attribute should be unique' },
      type: 'suggestion',
      fixable: 'code',
      schema: [], // no options
    },
    create (context) {
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
              message: `should make ${attributeName} unique. {{attribute}} has already defined in the file {{filename}}`,
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
}

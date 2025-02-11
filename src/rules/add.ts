import type { Rule } from 'eslint'
import type { AST } from 'vue-eslint-parser'
import type { PluginOptions } from '../types'
import * as path from 'node:path'
import { getAttributeNames, getAttributeValue } from '../utils/index.ts'

const searchingAttributes = new Set(['data-testid', 'dataTestid'])

export default function createRule ({
  buildDataTestid,
  ignoreNode = () => false,
}: PluginOptions): Rule.RuleModule {
  return {
    meta: {
      docs: { description: 'should add data-testid attribute' },
      messages: { add: 'add data-testid="{{attribute}}".' },
      type: 'suggestion',
      fixable: 'code',
      hasSuggestions: true,
      schema: [], // no options
    },
    create (context) {
      const filename = path.basename(context.filename)
      const extname = path.extname(context.filename)

      if (extname !== '.vue') {
        return {}
      }

      return context.sourceCode.parserServices.defineTemplateBodyVisitor({
        VElement (node: AST.VElement) {
          const isIgnored = ignoreNode(node.rawName)
          const isRoot = node.parent.parent?.type === 'VDocumentFragment'
          const attributeNames = getAttributeNames(node)
          const hasDataTestIdAttribute = attributeNames.intersection(searchingAttributes).size > 0
          const hasClassAttribute = attributeNames.has('class')
          const classNames = Iterator.from(getAttributeValue(node, 'class'))
            .flatMap(className => className.split(' '))
            .toArray()

          const [startRange] = node.startTag.range
          const nameLength = node.rawName.length

          if (
            !isIgnored &&
            !hasDataTestIdAttribute &&
            (hasClassAttribute || isRoot)
          ) {
            const dataTestids = classNames
              .map(className => buildDataTestid({
                filename,
                isRoot,
                className,
                classNames
              }))
              .filter(dataTestid => dataTestid != null)
              .filter(dataTestid => dataTestid.trim())

            const firstDataTestid = dataTestids.at(0)

            if (!firstDataTestid) {
              return {}
            }

            function fix (dataTestid: string, fixer: Rule.RuleFixer) {
              const message = ` data-testid="${dataTestid}"`
              return fixer.insertTextAfterRange(
                [startRange, startRange + nameLength + 1],
                message
              )
            }

            context.report({
              node: node as any,
              message: 'should add data-testid for further behavior testing',
              fix: fix.bind(undefined, firstDataTestid),
              suggest: dataTestids.map(dataTestid => ({
                data: { attribute: dataTestid },
                messageId: 'add',
                fix: fix.bind(undefined, dataTestid)
              }))
            })
          }
        }
      })
    }
  }
}

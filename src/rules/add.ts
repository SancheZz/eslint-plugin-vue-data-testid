import type { Rule } from 'eslint'
import type { AST } from 'vue-eslint-parser'
import type { DataTestidOptions, PluginOptions } from '../types'
import { getAttributeNames, getAttributeValue, calculateAttributeNames } from '../utils/index.ts'
import * as path from 'node:path'

export default function createRule ({
  attributeName = 'data-testid',
  buildDataTestid,
  ignoreNode = () => false,
}: PluginOptions): Rule.RuleModule {
  const searchedAttributeNames = calculateAttributeNames(attributeName)

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
          const isRoot = node.parent.parent?.type === 'VDocumentFragment'
          const attributeNames = getAttributeNames(node)
          const hasDataTestIdAttribute = attributeNames.intersection(searchedAttributeNames).size > 0
          const classNames = Iterator.from(getAttributeValue(node, 'class'))
            .flatMap(className => className.split(' '))
            .toArray()

          const [startRange] = node.startTag.range
          const nameLength = node.rawName.length

          if (hasDataTestIdAttribute) {
            return {}
          }

          const options: DataTestidOptions[] = classNames.map(className => ({
            nodeName: node.rawName,
            filepath: context.filename,
            filename,
            isRoot,
            className,
            classNames,
          }))

          if (!options.length) {
            options.push({
              nodeName: node.rawName,
              filepath: context.filename,
              filename,
              isRoot,
            })
          }

          const filteredOptions = options.filter(option => !ignoreNode(option))

          const dataTestids = filteredOptions
            .map(buildDataTestid)
            .filter(dataTestid => dataTestid != null)
            .filter(dataTestid => dataTestid.trim())

          const firstDataTestid = dataTestids.at(0)

          if (!firstDataTestid) {
            return {}
          }

          function fix (dataTestid: string, fixer: Rule.RuleFixer) {
            const message = ` ${attributeName}="${dataTestid}"`
            return fixer.insertTextAfterRange(
              [startRange, startRange + nameLength + 1],
              message
            )
          }

          context.report({
            node: node as any,
            message: `should add ${attributeName} for further behavior testing`,
            fix: fix.bind(undefined, firstDataTestid),
            suggest: dataTestids.map(dataTestid => ({
              data: { attribute: dataTestid },
              messageId: 'add',
              fix: fix.bind(undefined, dataTestid)
            }))
          })
        }
      })
    }
  }
}

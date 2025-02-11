import { AST } from 'vue-eslint-parser'

export default function getAttributeNames (node: AST.VElement) {
  const attributeNames = node.startTag.attributes
    .map(attribute =>
      attribute.key.type === 'VDirectiveKey'
        ? attribute.key.argument?.type === 'VIdentifier'
          ? attribute.key.argument.name
          : undefined
        : attribute.key.name
    )

  return new Set(attributeNames)
}

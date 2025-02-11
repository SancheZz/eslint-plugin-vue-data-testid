import { AST } from 'vue-eslint-parser'

export default function getAttributeValue (
  node: AST.VElement,
  attributeName: string
) {
  const values = node.startTag.attributes
    .filter(attribute =>
      attribute.key.type === 'VDirectiveKey'
        ? attribute.key.argument?.type === 'VIdentifier'
          ? attribute.key.argument.name === attributeName
          : false
        : attribute.key.name === attributeName
    )
    .map(attribute =>
      attribute.value?.type === 'VLiteral'
        ? attribute.value.value
        : undefined
    )
    .filter(attributeValue => attributeValue != null)

  return new Set(values)
}

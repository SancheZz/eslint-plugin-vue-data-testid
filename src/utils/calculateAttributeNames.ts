export default function calculateAttributeNames (attributeName: string) {
  const set = new Set([attributeName])

  set.add(
    attributeName
      .replace(/[A-Z]g/, input => '-' + input.toLowerCase())
      .replace(/^-|-$/g, '')
  )

  set.add(
    attributeName
      .replace(/-([a-z])/g, (_input, symbol) => symbol?.toUpperCase() ?? '')
  )

  return set
}

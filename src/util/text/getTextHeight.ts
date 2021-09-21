export const getTextHeight = (
  str: string,
  fontSize: number,
  maxLength: number
): number => {
  const length = str.length
  const height = Math.max(1, Math.ceil(length / maxLength)) * fontSize
  console.trace(
    str,
    length,
    `Math.max(1, Math.ceil(${length} / ${maxLength})) * ${fontSize}`,
    height
  )
  return height
}

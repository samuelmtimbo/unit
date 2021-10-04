export const getTextWidth = (
  str: string,
  fontSize: number,
  maxLength: number
) => {
  const length = str.length
  const width = (Math.min(length, maxLength) * fontSize) / 2
  // console.log(`(Math.min(${length}, ${maxLength}) * ${fontSize}) / 2`, width)
  return width
}

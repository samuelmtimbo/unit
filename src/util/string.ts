export function removeWhiteSpace(str: string): string {
  return str.replace(/\s/g, '')
}

export const upperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

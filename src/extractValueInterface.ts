export function extractValueInterface(data: any): string {
  if (typeof data === 'object') {
    if (data === null) {
      return null
    }

    if (data instanceof Array) {
      return 'A'
    } else {
      return 'J'
    }
  }

  return null
}

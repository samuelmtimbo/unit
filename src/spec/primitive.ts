const PRIMITIVE_TYPE_SET = new Set(['null', 'string', 'number', 'boolean'])

export function isPrimitive(data: any): boolean {
  const t = typeof data

  if (PRIMITIVE_TYPE_SET.has(t)) {
    return true
  }

  if (t === 'object') {
    if (Array.isArray(data)) {
      for (const element of data) {
        if (!isPrimitive(element)) {
          return false
        }
      }
    }
    for (const key in data) {
      const value = data[key]

      if (!isPrimitive(value)) {
        return false
      }
    }

    return true
  }

  return false
}

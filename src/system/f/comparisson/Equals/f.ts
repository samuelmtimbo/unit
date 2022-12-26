import { keys } from '../../object/Keys/f'

export default function isEqual(a: any, b: any): boolean {
  const ta = typeof a
  const tb = typeof b

  if (ta !== tb) {
    return false
  }

  if (
    ta === 'string' ||
    ta === 'number' ||
    ta === 'boolean' ||
    ta === 'symbol' ||
    ta === 'undefined' ||
    ta === 'function'
  ) {
    return a === b
  }

  if (ta === 'object') {
    if (a === b) {
      return true
    }

    const la = keys(a).length
    const lb = keys(b).length

    if (la !== lb) {
      return false
    }

    for (const ka in a) {
      const va = a[ka]
      const vb = b[ka]

      if (!isEqual(va, vb)) {
        return false
      }
    }
  }

  return true
}

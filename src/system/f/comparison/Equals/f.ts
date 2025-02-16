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
    if (a === null || b === null) {
      return a === b
    }

    if (a === b) {
      return true
    }

    for (let k in { ...a }) {
      if (a[k] === undefined) {
        delete a[k]
      }
    }
    for (let k in { ...b }) {
      if (b[k] === undefined) {
        delete b[k]
      }
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

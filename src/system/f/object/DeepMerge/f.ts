import { isObjNotNull } from './isObjNotNull'

export default function deepMerge(a: object, b: object): object {
  const _ = Array.isArray(a) ? [...a] : { ...a }

  _deepMerge(_, b)

  return _
}

export function _deepMerge(a: object, b: object): void {
  for (let k in b) {
    if (a[k] !== undefined && b[k] !== undefined) {
      const aObjNotNull = isObjNotNull(a[k])
      const bObjNotNull = isObjNotNull(b[k])

      if (aObjNotNull && bObjNotNull) {
        a[k] = deepMerge(a[k], b[k])
      } else {
        a[k] = b[k]
      }
    } else if (b[k] !== undefined) {
      a[k] = b[k]
    }
  }
}

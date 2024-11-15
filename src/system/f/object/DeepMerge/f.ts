import { isObjNotNull } from './isObjNotNull'

export default function deepMerge<T0 extends object, T1 extends object>(
  a: T0,
  b: T1
): T0 & T1 {
  const _ = Array.isArray(a) ? [...a] : ({ ...a } as T0)

  _deepMerge(_, b)

  return _ as T0 & T1
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

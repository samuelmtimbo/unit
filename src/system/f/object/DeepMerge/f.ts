import { isObjNotNull } from './isObjNotNull'

export default function deepMerge(a: object, b: object): object {
  const _ = Array.isArray(a) ? [...a] : { ...a }
  for (let k in b) {
    if (_[k] !== undefined && b[k] !== undefined) {
      const aObjNotNull = isObjNotNull(_[k])
      const bObjNotNull = isObjNotNull(b[k])
      if (aObjNotNull && bObjNotNull) {
        _[k] = deepMerge(_[k], b[k])
      } else {
        _[k] = b[k]
      }
    } else {
      _[k] = b[k]
    }
  }
  return _
}

import { $ } from '../Class/$'
import { Unit } from '../Class/Unit'
import { cloneUnit } from '../spec/cloneUnit'

export function $clone<T>(a: T): T {
  if (typeof a !== 'object' || a === null) {
    return a
  }

  if (a instanceof Set) {
    return new Set(a) as any
  }

  if (a.constructor.name === 'Array' || a.constructor.name === 'Object') {
    const _a = (Array.isArray(a) ? [] : {}) as T

    for (const k in a) {
      _a[k] = $clone(a[k])
    }

    return _a
  }

  if (a instanceof $) {
    if (a instanceof Unit) {
      return cloneUnit(a, false)[0]
    }
  }

  return a
}

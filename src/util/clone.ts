export function clone<T>(a: T): T {
  if (typeof a !== 'object' || a === null) {
    return a
  }

  if (a instanceof Set) {
    return new Set(a) as any
  }

  if (a.constructor.name === 'Array' || a.constructor.name === 'Object') {
    const _a = (Array.isArray(a) ? [] : {}) as T

    for (const k in a) {
      _a[k] = clone(a[k])
    }

    return _a
  }

  return a
}

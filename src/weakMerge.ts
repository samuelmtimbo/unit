export function weakMerge<A extends object, B extends object>(
  a: A,
  b: B
): A & B {
  const c = {}

  return new Proxy(c, {
    get(_, p) {
      return c[p] ?? b[p] ?? a[p]
    },
    set(_, p, v) {
      c[p] = v

      return true
    },
    has(_, p) {
      return p in c || p in b || p in a
    },
    deleteProperty(target, property) {
      if (c[property] !== undefined) {
        delete c[property]

        return true
      }

      if (b[property] !== undefined) {
        delete b[property]

        return true
      }

      if (a[property] !== undefined) {
        delete a[property]

        return true
      }

      return false
    },
    ownKeys() {
      return [
        ...new Set([
          ...Object.getOwnPropertyNames(a),
          ...Object.getOwnPropertyNames(b),
          ...Object.getOwnPropertyNames(c),
        ]),
      ]
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
        writable: true,
      }
    },
  }) as A & B
}

export function weakMerge<A extends object, B extends object>(
  a: A,
  b: B,
  c: A | B = b
): A & B {
  return new Proxy(b, {
    get(_, p) {
      return b[p] ?? a[p]
    },
    set(_, p, v) {
      c[p] = v

      return true
    },
    has(_, p) {
      return p in b || p in a
    },
    deleteProperty(target, property) {
      if (b[property] !== undefined) {
        delete b[property]

        return true
      } else if (a[property] !== undefined) {
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

export function weakReadMerge<A extends object, B extends object>(
  a: A,
  b: B,
): A & B {
  return new Proxy(b, {
    get(_, p) {
      return b[p] === undefined ? a[p] : b[p]
    },
    set(_, p, v) {
      a[p] = v

      return true
    },
    has(_, p) {
      return p in b || p in a
    },
    deleteProperty(target, property) {
      if (a[property] !== undefined) {
        delete b[property]

        return true
      }

      return false
    },
    ownKeys() {
      return [
        ...new Set([
          ...Object.getOwnPropertyNames(a),
          ...Object.getOwnPropertyNames(b),
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

import assert from '../util/assert'

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
      delete a[property]
      delete b[property]
      delete c[property]

      return true
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

assert.deepEqual(weakMerge({ a: 1, b: 2 }, { b: 3, c: 4 }), {
  a: 1,
  b: 3,
  c: 4,
})

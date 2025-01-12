import isEqual from '../system/f/comparison/Equals/f'

export function assert(test: boolean, message: string = ''): void {
  if (!test) {
    throw new Error(message)
  }
}

export function equal<T>(a: T, b: T, message: string = ''): void {
  return assert(a === b, message)
}

export function deepEqual<T>(a: T, b: T): void {
  return assert(
    isEqual(a, b),
    `${JSON.stringify(a, null, 2)} is not deep equal to ${JSON.stringify(
      b,
      null,
      2
    )}`
  )
}

assert.equal = equal
assert.deepEqual = deepEqual

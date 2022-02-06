import isEqual from '../system/f/comparisson/Equals/f'

export function assert(test: boolean, message: string = ''): void {
  if (!test) {
    throw new Error(message)
  }
}

export function equal<T>(a: T, b: T): void {
  return assert(a === b)
}

export function deepEqual<T>(a: T, b: T): void {
  return assert(
    isEqual(a, b),
    `${JSON.stringify(a, null, 1)} is not deep equal to ${JSON.stringify(
      b,
      null,
      1
    )}`
  )
}

assert.equal = equal
assert.deepEqual = deepEqual

export default assert

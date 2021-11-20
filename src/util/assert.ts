import isEqual from '../system/f/comparisson/Equals/f'

export function assert(test: boolean, message: string = ''): void {
  if (!test) {
    throw new Error(message)
  }
}

export function equal(a: any, b: any): void {
  return assert(a === b)
}

export function deepEqual(a: any, b: any): void {
  return assert(
    isEqual(a, b),
    `${JSON.stringify(a)} is not deep equal to ${JSON.stringify(b)}`
  )
}

assert.equal = equal
assert.deepEqual = deepEqual

export default assert

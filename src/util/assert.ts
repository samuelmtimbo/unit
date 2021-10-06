import isEqual from '../system/f/comparison/Equals/f'

export function assert(test: boolean, message: string = ''): void {
  if (!test) {
    throw new Error(message)
  }
}

export function assertEqual(a: any, b: any): void {
  const test = isEqual(a, b)
  return assert(test)
}

export default assert

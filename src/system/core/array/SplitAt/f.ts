import subtract from '../../../f/arithmetic/Subtract/f'
import length from '../../../f/array/Length/f'
import remove from '../../../f/array/Remove/f'
import identity from '../../../f/control/Identity/f'

export default function splitAt<T>({ a, i }: { a: T[]; i: number }): {
  first: T[]
  second: T[]
} {
  const { length: _length } = length({ a })
  const { 'a - b': count } = subtract({ a: _length, b: i })
  const { a: start } = identity({ a: i })
  const { removed, a: _a } = remove({ a, start, count })
  return {
    first: _a,
    second: removed,
  }
}

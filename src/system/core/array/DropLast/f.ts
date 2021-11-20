import subtract from '../../../f/arithmetic/Subtract/f'
import length from '../../../f/array/Length/f'
import splitAt from '../SplitAt/f'

export default function dropLast<T>({ ab, n }: { ab: T[]; n: number }): {
  a: T[]
} {
  const { length: _length } = length({ a: ab })
  const { 'a - b': i } = subtract({ a: _length, b: n })
  const { first } = splitAt({ a: ab, i })
  return {
    a: first,
  }
}

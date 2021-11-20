import splitAt from '../SplitAt/f'

export default function dropFirst<T>({ ab, n }: { ab: T[]; n: number }): {
  b: T[]
} {
  const { second } = splitAt({ a: ab, i: n })
  return {
    b: second,
  }
}

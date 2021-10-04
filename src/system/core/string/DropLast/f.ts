import slice from '../../../f/string/Slice/f'

export default function dropLast({ a, n }: { a: string; n: number }): {
  a: string
} {
  const begin = n
  const end = a.length - n
  const { a: _a } = slice({ a, begin, end })
  return { a: _a }
}

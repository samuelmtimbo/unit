export default function subtract({ a, b }: { a: number; b: number }): {
  'a - b': number
} {
  return {
    'a - b': a - b,
  }
}

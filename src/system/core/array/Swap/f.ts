export default function swap<T>(array: T[], i: number, j: number): T[] {
  const _array = [...array]
  const t = _array[i]
  _array[i] = _array[j]
  _array[j] = t
  return _array
}

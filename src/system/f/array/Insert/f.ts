export function insert<T>(a: T[], i: number, b: T): T[] {
  const _a = [...a]
  _a.splice(i, 0, b)
  return _a
}

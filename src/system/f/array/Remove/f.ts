export default function remove<T>({
  a,
  start,
  count,
}: {
  a: T[]
  start: number
  count: number
}): { a: T[]; removed: T[] } {
  const _a = [...a]
  const removed = _a.splice(start, count)
  return { a: _a, removed }
}

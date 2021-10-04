// TODO use `remove` and `first`
export default function removeIndex<T>({ a, i }: { a: T[]; i: number }): {
  a: T[]
  'a[i]': T
} {
  const _a = [...a]
  const [ai] = _a.splice(i, 1)
  return {
    a: _a,
    'a[i]': ai,
  }
}

export default function $indexOf<T>({ 'a[]': _a, a }: { 'a[]': T[]; a: T }): {
  i: number
} {
  return { i: _a.indexOf(a) }
}

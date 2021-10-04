export default function identity<T>({ a }: { a: T }): { a: T } {
  return { a }
}

export default function length<T>({ a }: { a: T[] }): { length: number } {
  return { length: a.length }
}

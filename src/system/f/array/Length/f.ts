export default function _length<T>({ a }: { a: T[] }): { length: number } {
  return { length: length(a) }
}

export function length<T>(a: T[]): number {
  return a.length
}

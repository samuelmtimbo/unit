export default function slice<T>({
  a,
  begin,
  end,
}: {
  a: T[]
  begin: number
  end: number
}): { a: T[] } {
  return { a: a.slice(begin, end ?? undefined) }
}

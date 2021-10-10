export default function slice({
  a,
  begin,
  end,
}: {
  a: string
  begin: number
  end: number
}): { a: string } {
  return { a: a.slice(begin, end) }
}

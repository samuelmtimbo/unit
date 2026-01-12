export function clamp(a: number, min: number, max: number): number {
  return Math.min(Math.max(a, min), max)
}

export default function _clamp<T>({
  a,
  min,
  max,
}: {
  a: number
  min: number
  max: number
}): { a: number } {
  return { a: clamp(a, min, max) }
}

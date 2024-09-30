export function getPathBoundingBox(d: string): {
  x1: number
  y1: number
  x2: number
  y2: number
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
} {
  const bb = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    width: 0,
    height: 0,
  }

  return bb
}

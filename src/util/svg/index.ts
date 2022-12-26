import svgPathBoundingBox = require('svg-path-bounding-box')

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
  const bb = svgPathBoundingBox(d)

  return bb
}

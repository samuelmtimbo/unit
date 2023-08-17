import { randomIntegerBetween } from '../../math'
import { Point, Position, Rect } from './types'

export const DEG = Math.PI / 180

export const TWO_PI = 2 * Math.PI

export function randomInRange(a: number, b: number): number {
  return a + Math.random() * (b - a)
}

export function pointDistance(a: Point, b: Point): number {
  return distance(a.x, a.y, b.x, b.y)
}

export function lineIntersect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): boolean {
  const d = (x1 - x0) * (y3 - y2) - (x3 - x2) * (y1 - y0) // determinant
  if (d === 0) {
    return false
  } else {
    const a = ((y3 - y2) * (x3 - x0) + (x2 - x3) * (y3 - y0)) / d
    const b = ((y0 - y1) * (x3 - x0) + (x1 - x0) * (y3 - y0)) / d
    return 0 < a && a < 1 && 0 < b && b < 1
  }
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  return d
}

export function _describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  return d
}

export function describeArrowPolygon(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  h: number,
  s: number,
  th: number,
  tl: number
) {
  const dx = x1 - x0
  const dy = y1 - y0
  const d = Math.sqrt(dx * dx + dy * dy)
  const c = d - th
  const ux = dx / d
  const uy = dy / d
  let alpha
  if (ux === 0) {
    alpha = ((uy / Math.abs(uy)) * Math.PI) / 2
  } else {
    alpha = Math.atan(uy / ux)
  }
  const px = Math.sin(alpha)
  const py = -Math.cos(alpha)

  const a = (s + h) / 2

  const apx = a * px
  const apy = a * py
  const atl = a + tl
  const atlpx = atl * px
  const atlpy = atl * py
  const cux = c * ux
  const cuy = c * uy
  const x0cux = x0 + cux
  const y0cuy = y0 + cuy

  const P0 = `${x0 + apx},${y0 + apy}`

  return `
    ${P0}
    ${x0cux + apx},${y0cuy + apy}
    ${x0cux + atlpx},${y0cuy + atlpy}
    ${x1},${y1}
    ${x0cux - atlpx},${y0cuy - atlpy}
    ${x0cux - apx},${y0cuy - apy}
    ${x0 - apx},${y0 - apy}
    ${P0}
 `
}

export function describeCircle(x: number, y: number, r: number) {
  const d = `M ${x - r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y - 0.001} z`
  return d
}

export function describeRect(
  x: number,
  y: number,
  width: number,
  height: number
) {
  const d = `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`
  return d
}

export function eccentricity(rx: number, ry: number, angle: number) {
  // flattening factor
  const ff = 1 - ry / rx
  const e2 = 2 * ff - ff * ff
  return e2
}

export const ellipsoidalToCartesian = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number
): { x: number; y: number } => {
  // flattening factor
  const ff = 1 - ry / rx
  let e2 = 2 * ff
  e2 -= ff * ff
  const N = rx / Math.sqrt(1 - e2 * Math.pow(Math.sin(angle), 2))
  const x = cx - N * Math.cos(angle)
  const y = cy - N * Math.sin(angle)
  return { x, y }
}

export function describeEllipseArc(
  x: number,
  y: number,
  rx: number,
  ry: number,
  startAngle: number,
  endAngle: number
) {
  const start = ellipsoidalToCartesian(x, y, rx, ry, startAngle)
  const end = ellipsoidalToCartesian(x, y, rx, ry, endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  const d = `M ${start.x} ${start.y} A ${rx} ${ry} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  return d
}

export function getRandomXYInArea(
  width: number,
  height: number,
  cX: number = 0,
  cY: number = 0
): Point {
  return {
    x: randomInRange(cX - width / 2, cX + width / 2),
    y: randomInRange(cY - height / 2, cY + height / 2),
  }
}

export function randomAngle(): number {
  return Math.random() * TWO_PI
}

export function angleToRad(angle: number): number {
  return ((angle % 360) * Math.PI) / 180
}

export function radToAngle(rad: number): number {
  return (rad * 180) / Math.PI
}

export function randomInRadius(cX: number, cY: number, R: number): Point {
  const angle = randomAngle()
  return {
    x: cX + R * Math.cos(angle),
    y: cY + R * Math.sin(angle),
  }
}

export function randomInAngle(
  cX: number,
  cY: number,
  R: number,
  start: number,
  end: number
): Point {
  const angle = randomIntegerBetween(start, end)
  const rad = angleToRad(angle)
  return {
    x: cX + R * Math.cos(rad),
    y: cY + R * Math.sin(rad),
  }
}

export function randomInRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Point {
  return {
    x: x0 + Math.random() * (x1 - x0),
    y: y0 + Math.random() * (y1 - y0),
  }
}

export function randomInPaddedRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  offset: number
): Point {
  return randomInRect(x0 - offset, y0 - offset, x1 + offset, y1 + offset)
}

export function randomInCircle(cX: number, cY: number, R: number): Point {
  const angle = randomAngle()
  return {
    x: cX + Math.random() * R * Math.cos(angle),
    y: cY + Math.random() * R * Math.sin(angle),
  }
}

export function pointInCircle(
  x: number,
  y: number,
  R: number,
  u: Point,
  padding: number = 0
) {
  return {
    x: x + u.x * (R - padding),
    y: y + u.y * (R - padding),
  }
}

export function pointInRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  u: Point,
  padding: number = 0
) {
  const region = rectangleRegion(x, y, width, height, u)
  const tan = u.x / u.y
  const a = Math.atan2(u.y, u.x)
  if (region === 'left' || region === 'right') {
    const sx = Math.sign(u.x)
    return {
      x: x + sx * (width / 2) - padding * Math.cos(a),
      y: y + sx * (width / 2 / tan) - padding * Math.sin(a),
    }
  } else {
    const sy = Math.sign(u.y)
    return {
      x: x + sy * ((height / 2) * tan) - padding * Math.cos(a),
      y: y + sy * (height / 2) - padding * Math.sin(a),
    }
  }
}

export function pointInNode(node: Thing, u: Point, padding: number = 0) {
  const { shape } = node
  if (shape === 'circle') {
    return pointInCircle(node.x, node.y, node.r, u, padding)
  } else {
    return pointInRectangle(node.x, node.y, node.width, node.height, u, padding)
  }
}

export const NULL_VECTOR: Point = { x: 0, y: 0 }

export function unitVector(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): Point {
  const dx = x1 - x0
  const dy = y1 - y0
  const d = norm(dx, dy)
  if (d === 0) {
    return randomUnitVector()
  }
  return { x: dx / d, y: dy / d }
}

export function pointUnitVector(
  { x: x0, y: y0 }: Point,
  { x: x1, y: y1 }: Point
): Point {
  const dx = x1 - x0
  const dy = y1 - y0
  const d = norm(dx, dy)
  if (d === 0) {
    return randomUnitVector()
  }
  return { x: dx / d, y: dy / d }
}

export function oppositeVector(vector: Point): Point {
  const { x, y } = vector
  return {
    x: -x,
    y: -y,
  }
}

export const applyVector = (point: Point, u: Point, d: number): Point => {
  return {
    x: point.x + u.x * d,
    y: point.y + u.y * d,
  }
}

export function vector(x0: number, y0: number, x1: number, y1: number): Point {
  return { x: x1 - x0, y: y1 - y0 }
}

export function jigglePoint(point: Point, intensity: number = 1): Point {
  const r = randomUnitVector()
  const jiggled = {
    x: point.x + intensity * r.x,
    y: point.y + intensity * r.y,
  }
  return jiggled
}

export function perpendicular(vector: Point): Point {
  return { x: -vector.y, y: vector.x }
}

// return the angle between two vectors in degrees
// [0, 360[
// assumes 0 is the origin
export const angleBetween = (
  ax: number,
  ay: number,
  bx: number,
  by: number
): number => {
  return radToAngle(radBetween(ax, ay, bx, by))
}

export const radBetween = (
  ax: number,
  ay: number,
  bx: number,
  by: number
): number => {
  // const d = distance(ax, ay, bx, by)
  // if (d === 0) {
  //   return 0
  // }
  let a = Math.atan2(by, bx) - Math.atan2(ay, ax)
  if (a < 0) {
    a += TWO_PI
  }
  return a
}

export function inRadius(
  cX: number,
  cY: number,
  R: number,
  angle: number
): Point {
  const rad = angleToRad(angle)
  return {
    x: cX + R * Math.cos(rad),
    y: cY + R * Math.sin(rad),
  }
}

export function distance(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return norm(ax - bx, ay - by)
}

export function norm(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

export function normalize(point: Point): Point {
  const { x, y } = point
  const d = norm(point.x, point.y)
  return { x: x / d, y: y / d }
}

export function mediumPoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export function randomUnitVector(): Point {
  return normalize({ x: 0.5 - Math.random(), y: 0.5 - Math.random() })
}

export function rotateVector(a: Point, rad: number): Point {
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return { x: a.x * cos - a.y * sin, y: a.x * sin + a.y * cos }
}

export function addVector(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function addVector3(a: Point, b: Point, c: Point): Point {
  return addVector(addVector(a, b), c)
}

export function addVector4(a: Point, b: Point, c: Point, d: Point): Point {
  return addVector(addVector(a, b), addVector(c, d))
}

export function subtractVector(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function resizeVector(a: Point, k: number): Point {
  return { x: a.x * k, y: a.y * k }
}

export function rectBoundingRadius(width: number, height: number) {
  return Math.sqrt(width * width + height + height) / 2
}

export function rectsBoundingRect(rects: Rect[]): Rect {
  if (rects.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = 0
  let maxY = 0

  for (const rect of rects) {
    minX = Math.min(minX, rect.x)
    minY = Math.min(minY, rect.y)
    maxX = Math.max(maxX, rect.x + rect.width)
    maxY = Math.max(maxY, rect.y + rect.height)
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function rectangleRegion(
  x: number,
  y: number,
  w: number,
  h: number,
  u: Point
): 'left' | 'top' | 'right' | 'bottom' {
  const { x: ux, y: uy } = u
  const { x: ax, y: ay } = unitVector(x, y, x - w / 2, y - h / 2)
  const { x: bx, y: by } = unitVector(x, y, x + w / 2, y - h / 2)
  const alpha = radBetween(ax, ay, bx, by)
  const beta = radBetween(ux, uy, bx, by)
  if (beta <= alpha) {
    return 'top'
  } else if (beta <= Math.PI) {
    return 'left'
  } else if (beta <= Math.PI + alpha) {
    return 'bottom'
  } else {
    return 'right'
  }
}

export type Shape = 'circle' | 'rect'

// TODO
export function bezierSpline(): Point[] {
  return []
}

export function isInside(a: Thing, b: Thing, offset: number = 0): boolean {
  if (a.shape === 'circle' && b.shape === 'circle') {
    return distance(a.x, a.y, b.x, b.y) <= b.r - a.r + offset
  } else if (a.shape === 'circle' && b.shape === 'rect') {
    return (
      a.x - a.r >= b.x - b.width / 2 - offset &&
      a.x + a.r <= b.x + b.width / 2 + offset &&
      a.y - a.r >= b.y - b.height / 2 - offset &&
      a.y + a.r <= b.y + b.height / 2 + offset
    )
  } else if (a.shape === 'rect' && b.shape === 'circle') {
    // https://stackoverflow.com/questions/14097290/check-if-circle-contains-rectangle
    const dx = Math.max(b.x - a.x + a.width / 2, a.x + a.width / 2 - b.x)
    const dy = Math.max(b.y - a.y + a.height / 2, a.y + a.height / 2 - b.y)

    return b.r >= Math.sqrt(dx * dx + dy * dy) - offset
  } else {
    return (
      a.x - a.width / 2 >= b.x - b.width / 2 - offset &&
      a.x + a.width / 2 <= b.x + b.width / 2 + offset &&
      a.y - a.height / 2 >= b.y - b.height / 2 - offset &&
      a.y + a.height / 2 <= b.y + b.height / 2 + offset
    )
  }
}

export function surfaceDistance(
  a: Thing,
  b: Thing
): { l: number; d: number; u: Point } {
  return _surfaceDistance(
    a.shape,
    a.x,
    a.y,
    a.r,
    a.width,
    a.height,
    b.shape,
    b.x,
    b.y,
    b.r,
    b.width,
    b.height
  )
}

export function _surfaceDistance(
  a_shape: Shape,
  a_x: number,
  a_y: number,
  a_r: number,
  a_width: number,
  a_height: number,
  b_shape: Shape,
  b_x: number,
  b_y: number,
  b_r: number,
  b_width: number,
  b_height: number
): { l: number; d: number; u: Point } {
  const d = distance(a_x, a_y, b_x, b_y)
  const u = unitVector(a_x, a_y, b_x, b_y)

  const a_d: number = _centerToSurfaceDistance(
    a_shape,
    a_x,
    a_y,
    a_r,
    a_width,
    a_height,
    u
  )
  const b_d: number = _centerToSurfaceDistance(
    b_shape,
    b_x,
    b_y,
    b_r,
    b_width,
    b_height,
    u
  )

  const d_sum = b_d + a_d

  const l = d - d_sum

  return {
    d,
    l,
    u,
  }
}

export function surfaceDistanceY(
  a: Thing,
  b: Thing
): { l: number; d: number; u: number } {
  const a_y = a.y
  const b_y = b.y

  const d = Math.abs(a_y - b_y)
  const u = Math.sign(a_y - b_y)

  const a_d: number = a.height / 2
  const b_d: number = b.height / 2

  let l: number
  const ds = b_d + a_d
  const dd = Math.abs(a_d - b_d)
  if (d <= ds && d >= dd - 1) {
    l = 0
  } else if (d < dd) {
    l = d - dd
  }
  l = d - ds

  return {
    d,
    l,
    u,
  }
}

export type Thing = {
  shape: Shape
  x: number
  y: number
  r: number
  width: number
  height: number
}

export function centerToSurfaceDistance(node: Thing, u: Position): number {
  const { shape, x, y, r, width, height } = node
  return _centerToSurfaceDistance(shape, x, y, r, width, height, u)
}

export function _centerToSurfaceDistance(
  shape: Shape,
  x: number,
  y: number,
  r: number,
  width: number,
  height: number,
  u: Position
): number {
  if (shape === 'circle') {
    return r
  } else {
    const tan = u.x / u.y
    const region = rectangleRegion(x, y, width, height, u)
    if (region === 'left' || region === 'right') {
      return norm(width / 2, width / 2 / tan)
    } else {
      return norm((height / 2) * tan, height / 2)
    }
  }
}

export function centerOfMass(points: Point[]): Point {
  let sum_x = 0
  let sum_y = 0

  const n = points.length

  for (let i = 0; i < points.length; i++) {
    const p = points[i]

    sum_x += p.x
    sum_y += p.y
  }

  const x = sum_x / n
  const y = sum_y / n

  return { x, y }
}

export const vectorAngle = (p0: Point, p1: Point): number => {
  let a = Math.atan2(p1.y - p0.y, p1.x - p0.x)
  if (a < 0) {
    a += TWO_PI
  }
  return a / DEG
}

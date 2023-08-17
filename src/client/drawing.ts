import { centerOfMass, DEG, pointDistance, vectorAngle } from './util/geometry'
import { Circle, Line, Point, Rect } from './util/geometry/types'

export function linearSample<T>(points: T[], n: number): any[] {
  let s: T[] = []
  for (let i = 0; i < points.length; i = i + n) {
    const p = points[i]
    s.push(p)
  }
  return s
}

function vectorDirection(p0: Point, p1: Point) {
  let a1 = vectorAngle(p0, p1)
  if ((a1 >= 0 && a1 <= 22.5) || (a1 > 337.5 && a1 < 360)) {
    return 'W'
  } else if (a1 > 22.5 && a1 <= 67.5) {
    return 'NW'
  } else if (a1 > 67.5 && a1 <= 112.5) {
    return 'N'
  } else if (a1 > 112.5 && a1 < 157.5) {
    return 'NE'
  } else if (a1 > 157.5 && a1 <= 202.5) {
    return 'E'
  } else if (a1 > 202.5 && a1 <= 240) {
    return 'SE'
  } else if (a1 > 240 && a1 <= 300) {
    return 'S'
  } else {
    // a1 > 300 && a1 <= 337.5
    return 'SE'
  }
}

export function getLine(
  points: Point[],
  max_deviation: number = 15
): Line | null {
  let sample = points

  const start = Math.floor(sample.length * 0.2)
  const end = Math.floor(sample.length * 0.8)
  sample = sample.slice(start, end)
  // sample = linearSample(sample, 2)

  const n = sample.length - 1

  let p0
  let p1

  p0 = sample[0]
  let sum_x = p0.x
  let sum_y = p0.y
  let m_sum = 0
  for (let i = 1; i < sample.length; i++) {
    p1 = sample[i]
    const m = Math.atan2(p1.y - p0.y, p1.x - p0.x)
    m_sum += m
    p0 = p1
    sum_x += p0.x
    sum_y += p0.y
  }
  const m_mean = m_sum / n

  p0 = sample[0]
  let std_sum = 0
  for (let i = 1; i < sample.length; i++) {
    p1 = sample[i]
    const m = Math.atan2(p1.y - p0.y, p1.x - p0.x)
    std_sum += Math.pow(m - m_mean, 2)
    p0 = p1
  }

  const std = Math.sqrt((1 / n) * std_sum)

  if (std < max_deviation * DEG) {
    const p0 = points[0]
    const p1 = points[points.length - 1]
    const cx = sum_x / sample.length
    const cy = sum_y / sample.length
    const d0 = Math.sqrt(Math.pow(cx - p0.x, 2) + Math.pow(cy - p0.y, 2))
    const d1 = Math.sqrt(Math.pow(cx - p1.x, 2) + Math.pow(cy - p1.y, 2))
    const x0 = cx - d0 * Math.cos(m_mean)
    const y0 = cy - d0 * Math.sin(m_mean)
    const x1 = cx + d1 * Math.cos(m_mean)
    const y1 = cy + d1 * Math.sin(m_mean)
    return { x0, y0, x1, y1 }
  } else {
    return null
  }
}

export function getRectangle(points: Point[]): Rect | null {
  points = linearSample(points, 2)

  let correctCount = 0
  let p0 = points[0]
  let p1 = points[1]
  let d0 = vectorDirection(p1, p0)
  const n = points.length - 1
  let east_count = 0
  let east_y_sum = 0
  let west_y_sum = 0
  let west_count = 0
  let north_x_sum = 0
  let north_count = 0
  let south_x_sum = 0
  let south_count = 0
  for (let i = 2; i <= n; i++) {
    p0 = p1
    p1 = points[i]
    const d1 = vectorDirection(p1, p0)
    switch (d0) {
      case 'E':
        east_count++
        east_y_sum += p0.y
        if (d1 === 'E' || d1 === 'S' || d1 === 'N') {
          correctCount++
        }
        break
      case 'N':
        north_count++
        north_x_sum += p0.x
        if (d1 === 'N' || d1 === 'E' || d1 === 'W') {
          correctCount++
        }
        break
      case 'W':
        west_count++
        west_y_sum += p0.y
        if (d1 === 'W' || d1 === 'N' || d1 === 'S') {
          correctCount++
        }
        break
      case 'S':
        south_count++
        south_x_sum += p0.x
        if (d1 === 'S' || d1 === 'W' || d1 === 'E') {
          correctCount++
        }
        break
      default:
        break
    }
    d0 = d1
  }

  if (east_count < 3 || west_count < 3 || south_count < 3 || north_count < 3) {
    return null
  }

  if (correctCount / n < 2 / 3) {
    return null
  }

  const east_y = east_y_sum / east_count
  const west_y = west_y_sum / west_count
  const north_x = north_x_sum / north_count
  const south_x = south_x_sum / south_count

  const x0 = Math.min(north_x, south_x)
  const y0 = Math.min(east_y, west_y)
  const x1 = Math.max(north_x, south_x)
  const y1 = Math.max(east_y, west_y)

  const x = x0
  const y = y0

  const width = x1 - x0
  const height = y1 - y0

  return { x, y, width, height }
}

export function getCircle(
  points: Point[],
  max_deviation: number = 0.2
): Circle | null {
  const c = centerOfMass(points)

  const n = points.length

  let d_sum = 0
  for (let i = 0; i < n; i++) {
    const p = points[i]
    const d = pointDistance(c, p)
    d_sum += d
  }

  const mean = d_sum / n
  let std_sum = 0
  for (let i = 0; i < n; i++) {
    const p = points[i]
    const d = pointDistance(c, p)
    std_sum += Math.pow(d - mean, 2)
  }
  const std = Math.sqrt(std_sum / (n - 1))

  if (std < max_deviation * mean) {
    const r = d_sum / n
    const x = c.x
    const y = c.y
    return { x, y, r }
  } else {
    return null
  }
}

import { pointDistance } from './util/geometry'
import { Circle, Point } from './util/geometry/types'

export function metaballField(x: number, y: number, circles: Circle[]) {
  let seen = new Set<string>()
  let sum = 0

  for (const c of circles) {
    const k = `${Math.round(c.x * 1e3)},${Math.round(c.y * 1e3)},${Math.round(c.r * 1e3)}`

    if (seen.has(k)) {
      continue
    }

    seen.add(k)

    const dx = x - c.x
    const dy = y - c.y

    const r = c.r

    const dist2 = dx * dx + dy * dy

    sum += (r * r) / (dx * dx + dy * dy + 1e-10)

    const influenceMultiplier = 1.5

    const cutoff = (c.r * influenceMultiplier) ** 2 // try multiplier 2–4

    if (dist2 < cutoff) {
      sum += (c.r * c.r) / dist2
    }
  }

  return sum
}

export function marchingSquares(
  circles: Circle[],
  gridStep = 2,
  threshold = 1.0,
  eps: number = 0.1,
  margin: number = 40
): Point[][] {
  let minX = Math.min(...circles.map((c) => c.x - c.r))
  let minY = Math.min(...circles.map((c) => c.y - c.r))
  let maxX = Math.max(...circles.map((c) => c.x + c.r))
  let maxY = Math.max(...circles.map((c) => c.y + c.r))

  minX -= margin
  minY -= margin
  maxX += margin
  maxY += margin

  const w = maxX - minX
  const h = maxY - minY

  const nx = Math.ceil(w / gridStep)
  const ny = Math.ceil(h / gridStep)

  const field: number[][] = Array.from({ length: ny + 1 }, (_, j) =>
    Array.from({ length: nx + 1 }, (_, i) =>
      metaballField(minX + i * gridStep, minY + j * gridStep, circles)
    )
  )

  const edgeLUT: [number, number][][] = [
    [],
    [[0, 3]],
    [[0, 1]],
    [[1, 3]],
    [[1, 2]],
    [
      [0, 1],
      [2, 3],
    ],
    [[0, 2]],
    [[2, 3]],
    [[2, 3]],
    [[0, 2]],
    [
      [1, 2],
      [0, 3],
    ],
    [[1, 2]],
    [[1, 3]],
    [[0, 1]],
    [[0, 3]],
    [],
  ]

  type Seg = [Point, Point]

  let segs: Seg[] = []

  function interpolate(
    x0: number,
    y0: number,
    v0: number,
    x1: number,
    y1: number,
    v1: number
  ): Point {
    const t = (threshold - v0) / (v1 - v0)

    return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t }
  }

  for (let j = 0; j < ny; ++j) {
    for (let i = 0; i < nx; ++i) {
      const v = [
        field[j][i],
        field[j][i + 1],
        field[j + 1][i + 1],
        field[j + 1][i],
      ]

      const x = minX + i * gridStep
      const y = minY + j * gridStep

      const pts: Point[] = [
        { x, y },
        { x: x + gridStep, y },
        { x: x + gridStep, y: y + gridStep },
        { x: x, y: y + gridStep },
      ]

      let idx = 0

      if (v[0] >= threshold) idx |= 1
      if (v[1] >= threshold) idx |= 2
      if (v[2] >= threshold) idx |= 4
      if (v[3] >= threshold) idx |= 8

      // if (idx === 0 || idx === 15) {
      //   continue
      // }

      const edgeMid = [
        () => interpolate(pts[0].x, pts[0].y, v[0], pts[1].x, pts[1].y, v[1]),
        () => interpolate(pts[1].x, pts[1].y, v[1], pts[2].x, pts[2].y, v[2]),
        () => interpolate(pts[2].x, pts[2].y, v[2], pts[3].x, pts[3].y, v[3]),
        () => interpolate(pts[3].x, pts[3].y, v[3], pts[0].x, pts[0].y, v[0]),
      ]

      for (const seg of edgeLUT[idx]) {
        const p0 = edgeMid[seg[0]]()
        const p1 = edgeMid[seg[1]]()

        segs.push([p0, p1])
      }
    }
  }

  let contours: Point[][] = []
  let used = new Array(segs.length).fill(false)

  function closeEnough(a: Point, b: Point) {
    return pointDistance(a, b) < eps
  }

  for (let s = 0; s < segs.length; ++s) {
    if (used[s]) {
      continue
    }

    let contour: Point[] = [segs[s][0], segs[s][1]]

    used[s] = true

    let changed = true

    while (changed) {
      changed = false

      for (let t = 0; t < segs.length; ++t) {
        if (used[t]) {
          continue
        }

        if (closeEnough(segs[t][0], contour[contour.length - 1])) {
          contour.push(segs[t][1])

          used[t] = true
          changed = true
        } else if (closeEnough(segs[t][1], contour[contour.length - 1])) {
          contour.push(segs[t][0])

          used[t] = true
          changed = true
        }
      }
    }

    if (closeEnough(contour[0], contour[contour.length - 1])) {
      contour.pop()
    }

    if (contour.length > 10) {
      contours.push(contour)
    }
  }

  return contours
}

export function pointsToSmoothPath(points: Point[]): string {
  if (points.length < 3) {
    return ''
  }

  let d = `M${points[0].x},${points[0].y}`

  const n = points.length

  for (let i = 0; i < n; ++i) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]

    const alpha = 0.4

    const c1: Point = {
      x: p1.x + (p2.x - p0.x) * alpha,
      y: p1.y + (p2.y - p0.y) * alpha,
    }
    const c2: Point = {
      x: p2.x - (p3.x - p1.x) * alpha,
      y: p2.y - (p3.y - p1.y) * alpha,
    }

    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`
  }

  d += 'Z'

  return d
}

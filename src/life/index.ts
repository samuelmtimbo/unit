import { randomBetween } from '../client/math'
import { resizeWithObserver } from '../client/resizeWith'
import root from '../client/root'
import {
  randomColorString,
  setAlpha,
} from '../client/theme'
import { clamp } from '../system/core/relation/Clamp/f'
import { rangeArray } from '../util/array'

const canvas = document.createElement('canvas')

let width = window.innerWidth
let height = window.innerHeight
let depth = 3

canvas.width = width
canvas.height = height

const resize = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
}

window.addEventListener('resize', resize)

resizeWithObserver(root, canvas, ResizeObserver)

root.appendChild(canvas)

const ctx = canvas.getContext('2d')

ctx.globalAlpha = 0.75

const drawRect = (x, y, c, w, h) => {
  ctx.fillStyle = c
  ctx.fillRect(x, y, w, h)
}

const draw = (x: number, y: number, r: number, c: string) => {
  ctx.fillStyle = c

  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI, false)
  ctx.fill()
}

let atoms = []

const makeAtom = (
  x: number,
  y: number,
  z: number,
  r: number,
  color: string
) => {
  return { x, y, z, vx: 0, vy: 0, vz: 0, r, color }
}

const random = () => {
  return Math.random()
}

const sign = () => {
  return Math.random() > 0.5 ? 1 : -1
}

const create = (n, color) => {
  const group = []

  const r = randomBetween(1, 9)

  for (let i = 0; i < n; i++) {
    const x = random() * width
    const y = random() * height
    const z = depth * (1 - 2 * random())

    const atom = makeAtom(x, y, z, r, color)

    group.push(atom)

    atoms.push(atom)
  }

  return group
}

let alpha = 1

let t = 1

let vis = 0.9

const rule = (atoms1, atoms2, g) => {
  for (let i = 0; i < atoms1.length; i++) {
    const a = atoms1[i]

    let fx = 0
    let fy = 0
    let fz = 0

    for (let j = 0; j < atoms2.length; j++) {
      const b = atoms2[j]

      const __x = a.x - b.x
      const __y = a.y - b.y
      const __z = a.z - b.z

      const _x = Math.abs(__x)
      const _y = Math.abs(__y)
      const _z = Math.abs(__z)

      const dx = Math.min(_x, width - _x)
      const dy = Math.min(_y, height - _y)
      const dz = Math.min(_z, depth - _z)

      const d = Math.sqrt(__x * __x + __y * __y + __z * __z)

      if (d > 0 && d < Math.cbrt(width * height * depth) / 2) {
        const F = (g * 1) / d / d

        fx += F * __x * t
        fy += F * __y * t
        fz += F * __z * t
      }
    }

    a.vx = (a.vx * vis + fx) * alpha
    a.vy = (a.vy * vis + fy) * alpha
    a.vz = (a.vz * vis + fz) * alpha

    a.x += a.vx * t
    a.y += a.vy * t
    a.z += a.vz * t

    if (a.x < 0 || a.x > width) {
      a.vx = -a.vx * 0.5

      a.x = clamp(a.x, 0, width)
    }

    if (a.y < 0 || a.y > height) {
      a.vy = -a.vy * 0.5

      a.y = clamp(a.y, 0, height)
    }

    if (a.z < -depth || a.z > depth) {
      a.vz = -a.vz * 0.5

      a.z = clamp(a.z, -depth, depth)
    }
  }
}

const MIN_N = 3
const MAX_N = 15

const K = 500

const Q_MIN = (25 * width * height) / K / K
const Q_MAX = (600 * width * height) / K / K

let all = []
let F = []

const reset = () => {
  atoms = []

  all = rangeArray(randomBetween(MIN_N, MAX_N)).map((i) => {
    const color = setAlpha(randomColorString(), 0.5 + random() * 0.25)
    const Q = randomBetween(Q_MIN, Q_MAX)

    return create(Q, color)
  })
  F = []

  for (let i = 0; i < all.length; i++) {
    for (let j = i; j < all.length; j++) {
      const f = 10 * sign() * random()

      F[i] = F[i] ?? []
      F[i][j] = f
    }
  }
}

reset()

const update = () => {
  for (let i = 0; i < all.length; i++) {
    for (let j = i; j < all.length; j++) {
      const f = F[i][j]

      rule(all[i], all[j], f)
    }
  }

  ctx.clearRect(0, 0, width, height)

  for (let i = 0; i < atoms.length; i++) {
    const atom = atoms[i]

    const { x, y, z, r, color } = atom

    const zr = (r * (z + depth)) / (2.0 * (depth ?? 1))

    draw(x, y, zr, color)
  }

  requestAnimationFrame(update)
}

update()

const delta = (deltaX, deltaY) => {
  alpha = clamp(alpha + deltaY, 0, 1)
  t = clamp(t + deltaX, 0, 2)
}

root.addEventListener('dblclick', () => {
  reset()
})

root.addEventListener('click', () => {
  // reset()
})

root.addEventListener('wheel', (event) => {
  const { deltaX, deltaY } = event

  delta(deltaX * 0.001, deltaY * 0.001)
})

let pointerDown = false
let pointerDownX = 0
let pointerDownY = 0

root.addEventListener('pointerdown', (event) => {
  pointerDown = true

  const { clientX, clientY } = event

  pointerDownX = clientX
  pointerDownY = clientY

  const pointerMoveListener = (event) => {
    const { clientX, clientY } = event

    const dx = (clientX - pointerDownX) / width / 10
    const dy = (-1 * (clientY - pointerDownY)) / height / 10

    delta(dx, dy)
  }

  root.addEventListener('pointermove', pointerMoveListener)

  root.addEventListener('pointerup', (event) => {
    pointerDown = false

    root.removeEventListener('pointermove', pointerMoveListener)
  })
})

root.addEventListener('pointerup', (event) => {
  pointerDown = false
})

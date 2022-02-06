import { EventEmitter, EventEmitter_EE } from '../EventEmitter'
import { NOOP } from '../NOOP'
import { Dict } from '../types/Dict'
import { Shape } from './util/geometry'

export type SimulationOpt = {
  alpha?: number
  alphaMin?: number
  alphaDecay?: number
  alphaTarget?: number
  velocityDecay?: number
  stability?: number
  n?: number
  force?: (alpha: number) => void
}

export type SimNode<T extends {} = {}> = T & {
  x: number
  y: number
  fx?: number
  fy?: number
  shape: Shape
  r: number
  width: number
  height: number
  vx: number
  vy: number
  ax: number
  ay: number
  hx: number
  hy: number
  _x: number
  _y: number
}

export interface SimLink<T> {
  d: number
  s: number
  source_id: string
  target_id: string
  padding: {
    source: number
    target: number
  }
  detail: T
}

const RK1C = 1
const RK10 = [1]
const RK11 = [1]

const RK2C = 2
const RK20 = [0, 1]
const RK21 = [1, 1]

const RK3C = 9
const RK30 = [0, 1 / 2, 3 / 4]
const RK31 = [2, 3, 4]

const RK4C = 6
const RK40 = [0, 0.5, 0.5, 1]
const RK41 = [1, 2, 2, 1]

const RKC = [RK1C, RK2C, RK3C, RK4C]
const RK = [
  [RK10, RK11],
  [RK20, RK21],
  [RK30, RK31],
  [RK40, RK41],
]

export type Simulation_EE = {
  tick: []
  end: []
}

export type SimulationEvents = EventEmitter_EE<Simulation_EE> & Simulation_EE

export class Simulation<N = {}, L = {}> extends EventEmitter<SimulationEvents> {
  public _nodes: Dict<SimNode<N>>
  public _links: Dict<SimLink<L>>

  private _paused: boolean = true

  private _alpha: number = 1
  private _alphaDecay: number
  private _alphaMin: number
  private _alphaTarget: number
  private _stability: number = 1
  private _velocityDecay: number
  private _n: number = 1

  private _force: (alpha: number) => void = NOOP

  private _frame: number

  constructor({
    alpha = 0.25,
    alphaMin = 0.001,
    alphaTarget = 0,
    alphaDecay,
    velocityDecay = 0.2,
    n = 3,
    stability = 1,
    force = NOOP,
  }: SimulationOpt) {
    super()

    this._alphaDecay =
      alphaDecay === undefined ? 1 - Math.pow(alphaMin, 1 / 300) : alphaDecay
    this._alpha = alpha
    this._alphaMin = alphaMin
    this._alphaTarget = alphaTarget
    this._velocityDecay = velocityDecay
    this._stability = stability
    this._n = n
    this._force = force
  }

  public start() {
    if (this._paused) {
      this._paused = false
      this._frame = requestAnimationFrame(this._tick)
    }
  }

  public restart() {
    this.start()
  }

  public stop() {
    this._paused = true
    cancelAnimationFrame(this._frame)
  }

  public nodes(nodes?: Dict<SimNode<N>>): Dict<SimNode<N>> {
    if (nodes !== undefined) {
      this._nodes = nodes
    }
    return this._nodes
  }

  public links(links?: Dict<SimLink<L>>): Dict<SimLink<L>> {
    if (links !== undefined) {
      this._links = links
    }
    return this._links
  }

  public alphaDecay(alphaDecay?: number): number {
    if (alphaDecay !== undefined) {
      this._alphaDecay = alphaDecay
    }
    return this._alphaDecay
  }

  public alphaMin(_alphaMin?: number): number {
    if (_alphaMin !== undefined) {
      this._alphaMin = _alphaMin
    }
    return this._alphaMin
  }

  public alpha(alpha?: number): number {
    if (alpha !== undefined) {
      this._alpha = alpha
    }
    return this._alpha
  }

  public velocityDecay(_velocityDecay?: number): number {
    if (_velocityDecay !== undefined) {
      this._velocityDecay = _velocityDecay
    }
    return this._velocityDecay
  }

  public alphaTarget(_alphaTarget?: number): number {
    if (_alphaTarget !== undefined) {
      this._alphaTarget = _alphaTarget
    }
    return this._alphaTarget
  }

  public stability(_stability?: number): number {
    if (_stability !== undefined) {
      this._stability = _stability
    }
    return this._stability
  }

  private _tick = (): void => {
    this._alpha += (this._alphaTarget - this._alpha) * this._alphaDecay

    if (this._alpha < this._alphaMin) {
      this.stop()
      this.emit('end')
      return
    }

    const rk: Dict<{
      _vx?: number
      _vy?: number
      _ax?: number
      _ay?: number
      x: number
      y: number
      vx: number
      vy: number
    }> = {}

    const F = 0.75 // friction
    const T = 1

    const order = this._stability

    const order_1 = order - 1

    const RKOC = RKC[order_1]
    const RKO = RK[order_1]

    const RKO0 = RKO[0]
    const RKO1 = RKO[1]

    for (let i = 0; i < this._n; i++) {
      for (let j = 0; j < order; j++) {
        this._force(this._alpha)

        const k0 = RKO0[j] * T
        const k1 = (RKO1[j] * T) / RKOC

        for (const node_id in this._nodes) {
          const node = this._nodes[node_id]

          if (j === 0) {
            const { x, y, vx, vy, ax, ay } = node

            rk[node_id] = { x, y, vx, vy, _vx: vx, _vy: vy, _ax: ax, _ay: ay }
          }

          const { ax, ay, fx, fy } = node

          const _rk = rk[node_id]

          const { x, y, vx, vy, _vx, _vy, _ax, _ay } = _rk

          if (fx === undefined) {
            const __x = x + _vx * k0
            const __vx = vx + _ax * k0
            const __ax = ax - F * __vx

            _rk._vx = __vx
            _rk._ax = __ax

            node._x = __x

            node.x += __vx * k1
            node.vx += __ax * k1
          } else {
            node.x = fx
            node.vx = 0
          }

          if (j === order_1) {
            node._x = node.x
          }

          node.ax = 0

          if (fy === undefined) {
            const __y = y + _vy * k0
            const __vy = vy + _ay * k0
            const __ay = ay - F * __vy

            _rk._vy = __vy
            _rk._ay = __ay

            node._y = __y

            node.y += __vy * k1
            node.vy += __ay * k1
          } else {
            node.y = fy
            node.vy = 0
          }

          if (j === order_1) {
            node._y = node.y
          }

          node.ay = 0
        }
      }
    }

    this.emit('tick')

    this._frame = requestAnimationFrame(this._tick)
  }
}

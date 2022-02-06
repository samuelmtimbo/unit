import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { replaceChild } from '../../../../../client/util/replaceChild'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { NOOP } from '../../../../../NOOP'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export function clearCanvas(context: CanvasRenderingContext2D) {
  const transform = context.getTransform()
  context.setTransform(1, 0, 0, 1, 0, 0)
  const width = context.canvas.width
  const height = context.canvas.height
  context.clearRect(0, 0, width, height)
  context.setTransform(transform)
  context.beginPath()
}

export interface Props {
  className?: string
  style?: Dict<string>
  width?: number
  height?: number
  d?: any[]
}

export const DEFAULT_STYLE: Dict<string> = {
  background: 'none',
  touchAction: 'none',
  display: 'block',
  imageResizing: 'pixelated',
  '-webkit-touch-callout': 'none',
  ...userSelect('none'),
}

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream
  }
}

export default class Canvas extends Element<HTMLCanvasElement, Props> {
  private _context: CanvasRenderingContext2D
  private _canvas_el: HTMLCanvasElement

  private _d: any[][] = []

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {} = $props

    this._reset()

    this.$element = this._canvas_el
  }

  private _reset = () => {
    const { className, style } = this.$props

    const old_canvas_el = this._canvas_el

    const canvas_el = this._create_canvas()
    if (className !== undefined) {
      canvas_el.className = className
    }

    applyStyle(this._canvas_el, { ...DEFAULT_STYLE, ...style })

    canvas_el.draggable = false

    this._canvas_el = canvas_el
    const context = canvas_el.getContext('2d')!
    this._context = context

    if (old_canvas_el) {
      replaceChild(old_canvas_el, canvas_el)
    }
  }

  private _create_canvas = () => {
    const { style, width = 200, height = 200 } = this.$props

    const canvas_el = this.$system.api.document.createElement('canvas')
    canvas_el.classList.add('canvas')
    canvas_el.width = width
    canvas_el.height = height
    applyStyle(canvas_el, { ...DEFAULT_STYLE, ...style })
    this._canvas_el = canvas_el
    return canvas_el
  }

  private _setup = () => {
    // this._setup_canvas()
    this._setup_context()
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._canvas_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'width') {
      this._canvas_el.setAttribute('width', `${current - 1}`)
      this._setup_context()
      this._redraw()
    } else if (prop === 'height') {
      this._canvas_el.setAttribute('height', `${current - 1}`)
      this._setup_context()
      this._redraw()
    } else if (prop === 'd') {
      this.clear()
      this._d = current
      this._draw_steps(current || [])
    }
  }

  private _draw(step: any[]) {
    const method = step[0]
    const args = step.slice(1, step.length)
    if (method === 'clear') {
      this.clear()
    } else if (method === 'fillStyle') {
      this._context.fillStyle = args[0]
    } else if (method === 'strokeStyle') {
      this._context.strokeStyle = args[0]
    } else {
      this._context[method](...args)
    }
  }

  private _draw_steps(steps: any[][]) {
    for (const step of steps) {
      this._draw(step)
    }
  }

  private _redraw = (): void => {
    // console.log('Graph', '_redraw')
    this._draw_steps(this._d)
  }

  private _setup_canvas = (): void => {
    const {
      api: {
        screen: { devicePixelRatio },
      },
    } = this.$system

    const { width = 200, height = 200 } = this.$props

    this._context.setTransform(1, 0, 0, 1, 0, 0)
    const dpr = devicePixelRatio || 1
    this._canvas_el.width = width * dpr
    this._canvas_el.height = height * dpr
    this._context.scale(1 / dpr, 1 / dpr)
  }

  private _setup_context = (): void => {
    // console.log('Canvas', '_setup_context')
    const { $color } = this.$context
    const context = this._canvas_el.getContext('2d')
    this._context = context
    this._context.strokeStyle = $color
    this._context.fillStyle = $color
    this._context.lineJoin = 'round'
    this._context.lineWidth = 3
  }

  onMount() {
    this._setup()
  }

  draw(step: any[]) {
    // console.log('draw', step)
    this._d.push(step)
    this._draw(step)
  }

  clear(_?: undefined) {
    clearCanvas(this._context)
    this._d = []
  }

  toBlob(
    { type, quality }: { type: string; quality: string },
    callback: (data: Blob | null) => void = NOOP
  ) {
    this._canvas_el.toBlob(callback, type, quality)
  }

  async captureStream({
    frameRate,
  }: {
    frameRate: number
  }): Promise<MediaStream> {
    if (this._canvas_el.captureStream) {
      return this._canvas_el.captureStream(frameRate)
    } else {
      throw new APINotSupportedError('Capture Stream')
    }
  }
}

import { draw } from '../../../../../client/canvas/draw'
import { Element } from '../../../../../client/element'
import { parseRelativeUnit } from '../../../../../client/parseRelativeUnit'
import { applyStyle, reactToFrameSize } from '../../../../../client/style'
import { COLOR_WHITE, defaultThemeColor } from '../../../../../client/theme'
import { replaceChild } from '../../../../../client/util/replaceChild'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { isRelativeValue } from '../../../../../isRelative'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { CA } from '../../../../../types/interface/CA'

export function clearCanvas(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) {
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
  attr?: Dict<string>
  width?: number | string
  height?: number | string
  sx?: number
  sy?: number
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

export default class CanvasComp
  extends Element<HTMLCanvasElement, Props>
  implements CA
{
  private _context: CanvasRenderingContext2D
  private _canvas_el: HTMLCanvasElement

  private _d: any[][] = []

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {} = $props

    this._reset()
    this._setup()

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
    const context = canvas_el.getContext('2d', { willReadFrequently: true })
    this._context = context

    this._context

    if (old_canvas_el) {
      replaceChild(old_canvas_el, canvas_el)
    }
  }

  private _get_parent_width = (): number => {
    // TODO
    return 0
  }

  private _get_parent_height = (): number => {
    // TODO
    return 0
  }

  private _get_frame_width = (): number => {
    // TODO
    return 0
  }

  private _get_frame_height = (): number => {
    // TODO
    return 0
  }

  private _create_canvas = () => {
    // console.log('CanvasComp', '_create_canvas', style)
    const { style, width = 200, height = 200 } = this.$props

    const canvas_el = this.$system.api.document.createElement('canvas')

    canvas_el.classList.add('canvas')

    canvas_el.width = parseRelativeUnit(
      width,
      this._get_parent_width,
      this._get_frame_height
    )
    canvas_el.height = parseRelativeUnit(
      height,
      this._get_parent_height,
      this._get_frame_height
    )

    applyStyle(canvas_el, { ...DEFAULT_STYLE, ...style })

    this._canvas_el = canvas_el

    return canvas_el
  }

  private _setup = () => {
    // this._setup_canvas()
    this._setup_context()
  }

  private _setup_redraw = () => {
    this._setup_context()
    this._redraw()
  }

  private _set_width = (width: number): void => {
    this._canvas_el.setAttribute('width', `${width - 1}`)

    this._setup_redraw()
  }

  private _set_height = (height: number): void => {
    this._canvas_el.setAttribute('height', `${height - 1}`)

    this._setup_redraw()
  }

  private _width_frame_unlisten: Unlisten
  private _height_frame_unlisten: Unlisten

  private _get_fill_style = (): string => {
    const { $theme } = this.$context ?? { $color: COLOR_WHITE, $theme: 'dark' }

    const final_style = { ...DEFAULT_STYLE, ...this.$props.style }

    const fallbackColor =
      final_style.strokeStyle ?? final_style.color ?? defaultThemeColor($theme)

    return fallbackColor
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Canvas', 'onPropChanged', prop, current)

    if (prop === 'style') {
      const final_style = { ...DEFAULT_STYLE, ...current }

      const color = this._get_fill_style().toLowerCase()

      applyStyle(this._canvas_el, final_style)

      if (
        this._context.fillStyle !== color ||
        this._context.strokeStyle !== color
      ) {
        this._context.fillStyle = color
        this._context.strokeStyle = color

        clearCanvas(this._context)

        this._redraw()
      }
    } else if (prop === 'width') {
      this._unlisten_frame_width()

      if (typeof current === 'string') {
        if (isRelativeValue(current)) {
          this._width_frame_unlisten = reactToFrameSize(
            current,
            this,
            this._set_width
          )
        } else {
          const width = Number.parseInt(current)

          if (Number.isNaN(width)) {
            //
          } else {
            this._set_width(width)
          }
        }
      } else {
        this._set_width(current)
      }
    } else if (prop === 'height') {
      this._unlisten_frame_height()

      if (typeof current === 'string') {
        if (isRelativeValue(current)) {
          this._height_frame_unlisten = reactToFrameSize(
            current,
            this,
            this._set_height
          )
        } else {
          const height = Number.parseInt(current)

          if (Number.isNaN(height)) {
            //
          } else {
            this._set_height(height)
          }
        }
      } else {
        this._set_height(current)
      }
    } else if (prop === 'd') {
      this.clear()

      this._d = current

      this._draw_steps(current || [])
    } else if (prop === 'lineWidth') {
      this._context.lineWidth = current
    } else if (prop === 'sx') {
      const { a, b, c, d, e, f } = this._context.getTransform()

      this._context.setTransform(current ?? 1, b, c, d, e, f)
    } else if (prop === 'sy') {
      const { a, b, c, d, e, f } = this._context.getTransform()

      this._context.setTransform(a, b, c, current ?? 1, e, f)
    }
  }

  private _unlisten_frame_width() {
    if (this._width_frame_unlisten) {
      this._width_frame_unlisten()
      this._width_frame_unlisten = undefined
    }
  }

  private _unlisten_frame_height() {
    if (this._height_frame_unlisten) {
      this._height_frame_unlisten()
      this._height_frame_unlisten = undefined
    }
  }

  private _draw(step: any[]) {
    // console.log('Canvas', '_draw')

    draw(this._context, step)
  }

  private _draw_steps(steps: any[][]) {
    for (const step of steps) {
      this._draw(step)
    }
  }

  private _redraw = (): void => {
    // console.log('Graph', '_redraw', this._d)

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

    const _width = parseRelativeUnit(
      width,
      this._get_parent_width,
      this._get_frame_height
    )
    const _height = parseRelativeUnit(
      height,
      this._get_parent_height,
      this._get_frame_height
    )

    this._canvas_el.width = _width * dpr
    this._canvas_el.height = _height * dpr

    this._context.scale(1 / dpr, 1 / dpr)
  }

  private _setup_context = (): void => {
    // console.log('Canvas', '_setup_context')

    const { sx = 1, sy = 1 } = this.$props

    const color = this._get_fill_style()

    const context = this._canvas_el.getContext('2d')

    this._context = context

    if (this._context) {
      this._context.strokeStyle = color
      this._context.fillStyle = color
      this._context.lineJoin = 'round'
      this._context.lineWidth = 3

      this._context.scale(sx, sy)
    }
  }

  onMount() {
    this._setup()
  }

  async draw(step: any[]) {
    // console.log('draw', step)
    this._d.push(step)

    this._draw(step)
  }

  async clear(_?: undefined) {
    clearCanvas(this._context)

    this._d = []
  }

  async drawImage(
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (image instanceof ImageBitmap) {
      this._context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        x,
        y,
        width,
        height
      )
    } else {
      this._context.drawImage(image, x, y, width, height)
    }
  }

  strokePath(d: string) {
    // console.log('Canvas', 'strokePath', d)

    this._d.push(['strokePath', d])

    this._strokePath(d)
  }

  private _strokePath(d: string) {
    // console.log('Canvas', '_strokePath', d)

    this._context.stroke(new Path2D(d))
  }

  fillPath(d: string, fillRule: CanvasFillRule) {
    // console.log('Canvas', 'fillPath', d)

    this._d.push(['fillPath', d, fillRule])

    this._fillPath(d, fillRule)
  }

  private _fillPath(d: string, fillRule: CanvasFillRule) {
    // console.log('Canvas', '_fillPath', d)

    this._context.fill(new Path2D(d), fillRule)
  }

  translate(x: number, y: number) {
    // console.log('Canvas', 'translate', x, y)

    this._context.translate(x, y)
  }

  scale(sx: number, sy: number) {
    // console.log('Canvas', 'scale', sx, sy)

    this._context.scale(sx, sy)
  }

  async toBlob(type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this._canvas_el.toBlob(
        (blob: Blob) => {
          resolve(blob)
        },
        type,
        quality
      )
    })
  }

  async toDataUrl(type: string, quality: number) {
    return this._canvas_el.toDataURL()
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

  async getImageData(
    x: number,
    y: number,
    width: number,
    height: number,
    opt: ImageDataSettings
  ): Promise<ImageData> {
    return this._context.getImageData(x, y, width, height, opt)
  }

  async putImageData(
    image: ImageData,
    dx: number,
    dy: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    this._context.putImageData(image, dx, dy, x, y, width, height)
  }
}

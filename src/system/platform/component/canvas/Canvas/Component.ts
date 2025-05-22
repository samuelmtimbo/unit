import { draw } from '../../../../../client/canvas/draw'
import { getSize } from '../../../../../client/getSize'
import HTMLElement_ from '../../../../../client/html'
import { parseRelativeUnit } from '../../../../../client/parseRelativeUnit'
import { applyStyle, reactToFrameSize } from '../../../../../client/style'
import { COLOR_WHITE, defaultThemeColor } from '../../../../../client/theme'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { isRelativeValue } from '../../../../../isRelative'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { CA } from '../../../../../types/interface/CA'

export function clearCanvas(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) {
  context.setTransform(1, 0, 0, 1, 0, 0)

  const width = context.canvas.width
  const height = context.canvas.height

  context.clearRect(0, 0, width, height)
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

export default class Canvas_
  extends HTMLElement_<HTMLCanvasElement, Props>
  implements CA
{
  private _ctx: CanvasRenderingContext2D
  private _d: any[][] = []

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('canvas'),
      $system.style['canvas'],
      {
        draggable: false,
      },
      {
        style: (current) => {
          const final_style = { ...this.$defaultStyle, ...current }

          const color = this._get_fill_style().toLowerCase()

          applyStyle(this.$element, final_style)

          if (
            this._ctx.fillStyle !== color ||
            this._ctx.strokeStyle !== color
          ) {
            this._ctx.fillStyle = color
            this._ctx.strokeStyle = color

            clearCanvas(this._ctx)

            this._redraw()
          }
        },
        width: (width: number) => {
          this._unlisten_frame_width()

          if (typeof width === 'string') {
            if (isRelativeValue(width)) {
              this._width_frame_unlisten = reactToFrameSize(
                width,
                // @ts-ignore
                this,
                this._set_width
              )
            } else {
              width = Number.parseInt(width)

              if (Number.isNaN(width)) {
                //
              } else {
                this._set_width(width)
              }
            }
          } else {
            this._set_width(width)
          }
        },
        height: (height: string | number) => {
          this._unlisten_frame_height()

          if (typeof height === 'string') {
            if (isRelativeValue(height)) {
              this._height_frame_unlisten = reactToFrameSize(
                height,
                // @ts-ignore
                this,
                this._set_height
              )
            } else {
              height = Number.parseInt(height)

              if (Number.isNaN(height)) {
                //
              } else {
                this._set_height(height)
              }
            }
          } else {
            this._set_height(height)
          }
        },
        d: (d: any[]) => {
          this.clear()

          this._d = d || []

          this._draw_steps(this._d)
        },
        lineWidth: (lineWidth: number | undefined = 3) => {
          this._ctx.lineWidth = lineWidth
        },
        x: (x) => {
          const { a, b, c, d, e, f } = this._ctx.getTransform()

          this._ctx.setTransform(a, b, c, d, x ?? 0, f)
        },
        y: (y) => {
          const { a, b, c, d, e, f } = this._ctx.getTransform()

          this._ctx.setTransform(a, b, c, d, e, y ?? 0)
        },
        sx: (sx) => {
          const { a, b, c, d, e, f } = this._ctx.getTransform()

          this._ctx.setTransform(sx ?? 1, b, c, d, e, f)
        },
        sy: (sy) => {
          const { a, b, c, d, e, f } = this._ctx.getTransform()

          this._ctx.setTransform(a, b, c, sy ?? 1, e, f)
        },
      }
    )

    const { width = 200, height = 200, d } = this.$props

    this.$element.width = parseRelativeUnit(
      width,
      this._get_parent_width(),
      this._get_frame_width()
    )
    this.$element.height = parseRelativeUnit(
      height,
      this._get_parent_height(),
      this._get_frame_height()
    )

    const ctx = this.$element.getContext('2d', { willReadFrequently: true })

    this._ctx = ctx

    this._reset()

    if (d) {
      this._draw_steps(d)
    }
  }

  public reset() {
    super.reset()

    this._reset()
    this._clear()
  }

  private _setup = () => {}

  private _get_parent_width = (): number => {
    if (this.$slotParent) {
      return getSize(this.$slotParent.$element).width
    }

    return 0
  }

  private _get_parent_height = (): number => {
    if (this.$slotParent) {
      return getSize(this.$slotParent.$element).width
    }

    return 0
  }

  private _get_frame_width = (): number => {
    const { $width } = this.$context

    return $width
  }

  private _get_frame_height = (): number => {
    const { $height } = this.$context

    return $height
  }

  private _reset = () => {
    this._reset_context()
  }

  private _reset_redraw = () => {
    this._reset()
    this._redraw()
  }

  private _set_width = (width: number): void => {
    this.$element.setAttribute('width', `${width}`)

    this._reset_redraw()
  }

  private _set_height = (height: number): void => {
    this.$element.setAttribute('height', `${height}`)

    this._reset_redraw()
  }

  private _width_frame_unlisten: Unlisten
  private _height_frame_unlisten: Unlisten

  private _get_fill_style = (): string => {
    const { $theme } = this.$context ?? { $color: COLOR_WHITE, $theme: 'dark' }

    const final_style = { ...this.$defaultStyle, ...this.$props.style }

    const fallbackColor =
      final_style.strokeStyle ?? final_style.color ?? defaultThemeColor($theme)

    return fallbackColor
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

    draw(this._ctx, step)
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

  private _reset_context = (): void => {
    // console.log('Canvas', '_reset_context')

    const { sx = 1, sy = 1 } = this.$props

    const color = this._get_fill_style()

    const context = this.$element.getContext('2d')

    this._ctx = context

    this._ctx.setTransform(1, 0, 0, 1, 0, 0)

    this._ctx.strokeStyle = color
    this._ctx.fillStyle = color
    this._ctx.lineJoin = 'round'
    this._ctx.lineCap = 'round'
    this._ctx.lineWidth = 3

    this._ctx.scale(sx, sy)
  }

  onMount() {
    this._reset()
  }

  async draw(step: any[]) {
    // console.log('draw', step)
    this._d.push(step)

    this._draw(step)
  }

  async clear() {
    this._clear()
  }

  private _clear() {
    clearCanvas(this._ctx)

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
      this._ctx.drawImage(
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
      this._ctx.drawImage(image, x, y, width, height)
    }
  }

  strokePath(d: string) {
    // console.log('Canvas', 'strokePath', d)

    this._d.push(['strokePath', d])

    this._strokePath(d)
  }

  private _strokePath(d: string) {
    // console.log('Canvas', '_strokePath', d)

    this._ctx.stroke(new Path2D(d))
  }

  fillPath(d: string, fillRule: CanvasFillRule) {
    // console.log('Canvas', 'fillPath', d)

    this._d.push(['fillPath', d, fillRule])

    this._fillPath(d, fillRule)
  }

  private _fillPath(d: string, fillRule: CanvasFillRule) {
    // console.log('Canvas', '_fillPath', d)

    this._ctx.fill(new Path2D(d), fillRule)
  }

  translate(x: number, y: number) {
    // console.log('Canvas', 'translate', x, y)

    this._ctx.translate(x, y)
  }

  scale(sx: number, sy: number) {
    // console.log('Canvas', 'scale', sx, sy)

    this._ctx.scale(sx, sy)
  }

  async toBlob(type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.$element.toBlob(
        (blob: Blob) => {
          resolve(blob)
        },
        type,
        quality
      )
    })
  }

  async toDataUrl(type: string, quality: number) {
    return this.$element.toDataURL()
  }

  async captureStream({
    frameRate,
  }: {
    frameRate: number
  }): Promise<MediaStream> {
    if (this.$element.captureStream) {
      return this.$element.captureStream(frameRate)
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
    return this._ctx.getImageData(x, y, width, height, opt)
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
    this._ctx.putImageData(image, dx, dy, x, y, width, height)
  }
}

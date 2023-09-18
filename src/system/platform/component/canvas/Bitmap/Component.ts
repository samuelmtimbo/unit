import { Element } from '../../../../../client/element'
import { parseRelativeUnit } from '../../../../../client/parseRelativeUnit'
import { applyStyle, reactToFrameSize } from '../../../../../client/style'
import { COLOR_WHITE, defaultThemeColor } from '../../../../../client/theme'
import { replaceChild } from '../../../../../client/util/replaceChild'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { NOOP } from '../../../../../NOOP'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'

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

export default class CanvasComp extends Element<HTMLCanvasElement, Props> {
  private _context: ImageBitmapRenderingContext
  private _canvas_el: HTMLCanvasElement

  private _d: any[][] = []

  constructor($props: Props, $system: System) {
    super($props, $system)

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
    const context = canvas_el.getContext('bitmaprenderer')
    this._context = context

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

  private _set_width = (width: number): void => {
    this._canvas_el.setAttribute('width', `${width - 1}`)
  }

  private _set_height = (height: number): void => {
    this._canvas_el.setAttribute('height', `${height - 1}`)
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

      const color = this._get_fill_style()

      applyStyle(this._canvas_el, final_style)
    } else if (prop === 'width') {
      this._unlisten_frame_width()

      if (typeof current === 'string') {
        this._width_frame_unlisten = reactToFrameSize(
          current,
          this,
          this._set_width
        )
      } else {
        this._set_width(current)
      }
    } else if (prop === 'height') {
      this._unlisten_frame_height()

      if (typeof current === 'string') {
        this._height_frame_unlisten = reactToFrameSize(
          current,
          this,
          this._set_height
        )
      } else {
        this._set_height(current)
      }
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

  clear(_?: undefined) {
    // clearCanvas(this._context)

    this._d = []
  }

  transferFromImageBitmap(imageBitmap: ImageBitmap) {
    // console.log('Bitmap', 'transferFromImageBitmap', imageBitmap)

    this._context.transferFromImageBitmap(imageBitmap)
  }

  toBlob(
    { type, quality }: { type: string; quality: number },
    callback: (data: Blob | null) => void = NOOP
  ) {
    this._canvas_el.toBlob(callback, type, quality)
  }
}

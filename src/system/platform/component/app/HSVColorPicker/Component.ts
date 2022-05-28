import { HSVToHEX, hueToColor } from '../../../../../client/color'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { IOPointerEvent } from '../../../../../client/event/pointer'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../types/global/dom'
import clamp from '../../../../core/relation/Clamp/f'
import Div from '../../Div/Component'

export interface Props {
  style?: Dict<string>
  h?: number
  s?: number
  v?: number
}

export const DEFAULT_STYLE = {
  position: 'absolute',
  overflow: 'hidden',
  touchAction: 'none',
}

export const PICKER_SIZE = 12

export default class HSVColorPicker extends Element<IHTMLDivElement, Props> {
  private _color_picker: Div
  private _picker: Div
  private _background: Div

  private _s: number = 100
  private _v: number = 100

  private _pointer_down: Dict<boolean> = {}

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style, h = 0, s = 100, v = 100 } = $props

    this._s = s
    this._v = v

    const backgroundColor = hueToColor(h)

    const picker_inner = new Div(
      {
        style: {
          position: 'absolute',
          left: '1px',
          top: '1px',
          width: `${PICKER_SIZE - 2}px`,
          height: `${PICKER_SIZE - 2}px`,
          border: `1px solid white`,
          boxSizing: 'border-box',
          borderRadius: '50%',
        },
      },
      this.$system,
      this.$pod
    )

    const picker_outer = new Div(
      {
        style: {
          position: 'absolute',
          width: `${PICKER_SIZE}px`,
          height: `${PICKER_SIZE}px`,
          border: `1px solid black`,
          boxSizing: 'border-box',
          borderRadius: '50%',
        },
      },
      this.$system,
      this.$pod
    )

    const picker = new Div(
      {
        style: {
          position: 'absolute',
          width: `${PICKER_SIZE}px`,
          height: `${PICKER_SIZE}px`,
          left: `${s}%`,
          top: `${100 - v}%`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    picker.registerParentRoot(picker_outer)
    picker.registerParentRoot(picker_inner)
    this._picker = picker

    const val = new Div(
      {
        style: {
          position: 'absolute',
          backgroundImage:
            'linear-gradient(to top, #000, rgba(204, 154, 129, 0))',
        },
      },
      this.$system,
      this.$pod
    )
    val.registerParentRoot(picker)

    const sat = new Div(
      {
        style: {
          position: 'absolute',
          backgroundImage:
            'linear-gradient(to right, #fff, rgba(204, 154, 129, 0))',
        },
      },
      this.$system,
      this.$pod
    )
    sat.registerParentRoot(val)

    const background = new Div(
      {
        style: {
          position: 'absolute',
          backgroundColor,
        },
      },
      this.$system,
      this.$pod
    )
    background.registerParentRoot(sat)
    this._background = background

    const color_picker = new Div(
      {
        className: 'color-picker',
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    color_picker.registerParentRoot(background)
    this._color_picker = color_picker

    this.$element = color_picker.$element
    this.$slot['default'] = color_picker.$slot['default']
    this.$subComponent = {
      color_picker,
      background,
      sat,
      val,
      picker,
      picker_outer,
      picker_inner,
    }

    this.registerRoot(color_picker)

    // PERF
    this.addEventListener(makePointerDownListener(this._on_pointer_down))
    this.addEventListener(makePointerMoveListener(this._on_pointer_move))
    this.addEventListener(makePointerUpListener(this._on_pointer_up))
  }

  private _getValue = (): string => {
    const { h = 0 } = this.$props
    const hex = HSVToHEX(h, this._s, this._v)
    return hex
  }

  private _on_pointer_down = (event: IOPointerEvent, _event: PointerEvent) => {
    // console.log('HSVColorPicker', '_on_pointer_down')
    const { pointerId } = event
    this._pointer_down[pointerId] = true
    this.setPointerCapture(pointerId)
    this._on_drag(event)
    this.dispatchEvent('input', this._getValue())
  }

  private _on_drag = (event: IOPointerEvent): void => {
    const { offsetX, offsetY } = event
    const bcr = this.getBoundingClientRect()
    const { width, height } = bcr
    const { a: s } = clamp({ a: (offsetX / width) * 100, min: 0, max: 100 })
    const { a: v } = clamp({
      a: (1 - offsetY / height) * 100,
      min: 0,
      max: 100,
    })
    this._s = s
    this._v = v
    this._refresh_sv()
  }

  private _refresh_s = (): void => {
    mergePropStyle(this._picker, {
      left: `${this._s}%`,
    })
  }

  private _refresh_v = (): void => {
    mergePropStyle(this._picker, {
      top: `${100 - this._v}%`,
    })
  }

  private _refresh_sv = (): void => {
    this._refresh_s()
    this._refresh_v()
  }

  private _on_pointer_move = (event: IOPointerEvent) => {
    // console.log('HSVColorPicker', '_on_pointer_move')
    const { pointerId } = event
    if (this._pointer_down[pointerId]) {
      this._on_drag(event)
      this.dispatchEvent('input', this._getValue())
    }
  }

  private _on_pointer_up = (event: IOPointerEvent, _event: PointerEvent) => {
    // log('HSVColorPicker', '_on_pointer_up')
    const { pointerId } = event
    this.releasePointerCapture(pointerId)
    delete this._pointer_down[pointerId]
    this.dispatchEvent('change', this._getValue())
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._color_picker.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    } else if (prop === 'h') {
      const { h = 0 } = this.$props
      const backgroundColor = hueToColor(h)
      mergePropStyle(this._background, {
        backgroundColor,
      })
    } else if (prop === 's') {
      this._s = current
      this._refresh_s()
    } else if (prop === 'v') {
      this._v = current
      this._refresh_v()
    }
  }
}

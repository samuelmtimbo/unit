import { nameToColor } from '../../../../../client/color'
import { Element } from '../../../../../client/element'
import {
  emitKeyboardEvent,
  keyToIcon,
} from '../../../../../client/event/keyboard'
import {
  keyToCode,
  keyToKeyCode,
} from '../../../../../client/event/keyboard/keyCode'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { Dict } from '../../../../../types/Dict'
import Div from '../../../../platform/component/Div/Component'
import Icon from '../../Icon/Component'

export interface Props {
  style?: Dict<string>
  key?: string
  location?: number
  shiftKey?: boolean
  altKey?: boolean
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
}

export default class KeyboardKey extends Element<HTMLDivElement, Props> {
  private _key: Div

  constructor($props: Props) {
    super($props)

    const { key = 'a', location = 0 } = this.$props

    const icon = keyToIcon[key]

    const code = keyToCode[key]
    const keyCode = keyToKeyCode[key]

    const style = this._get_style()

    const key_component = new Div({
      style,
      innerText: icon ? undefined : key,
    })

    key_component.addEventListener(
      makePointerDownListener(() => {
        emitKeyboardEvent('keydown', {
          key,
          // @ts-ignore
          keyCode,
          code,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          bubbles: true,
        })
        // TODO 'keypress' should not be fired if key is a control key (e.g. ALT, CTRL, SHIFT, ESC)
        emitKeyboardEvent('keypress', {
          key,
          // @ts-ignore
          keyCode,
          code,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          bubbles: true,
        })
      })
    )

    key_component.addEventListener(
      makePointerUpListener(() => {
        emitKeyboardEvent('keyup', {
          key,
          // @ts-ignore
          keyCode,
          code,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          bubbles: true,
        })
      })
    )
    this._key = key_component

    if (icon !== undefined) {
      const icon_component = new Icon({
        icon,
        style: {
          width: '18px',
          height: '18px',
        },
      })
      key_component.setChildren([icon_component])
    }

    this.$element = key_component.$element
    this.$slot = key_component.$slot
  }

  private _get_style = () => {
    const { style = {} } = this.$props
    let { color = 'currentColor' } = style
    color = nameToColor(color) || color

    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: `calc(100%)`,
      width: `calc(100%)`,
      overflow: 'hidden',
      userSelect: 'none',
      color,
      border: `1px solid ${color}`,
      fontSize: '14px',
      borderRadius: '2px',
      boxSizing: 'border-box',
      cursor: 'pointer',
      textAlign: 'center',
      ...style,
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      const style = this._get_style()
      this._key.setProp('style', style)
    }
  }
}

import { nameToColor } from '../../../../../client/color'
import { Element } from '../../../../../client/element'
import { keyToIcon } from '../../../../../client/event/keyboard'
import {
  keyToCode,
  keyToKeyCode,
} from '../../../../../client/event/keyboard/keyCode'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import parentElement from '../../../../../client/platform/web/parentElement'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Icon from '../../../component/Icon/Component'
import Button from '../../Button/Component'

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
  background: 'none',
}

export default class KeyboardKey extends Element<HTMLDivElement, Props> {
  private _key: Button

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { key = 'a', location = 0 } = this.$props

    const icon = keyToIcon[key]

    const code = keyToCode[key]
    const keyCode = keyToKeyCode[key]

    const style = this._get_style()

    const key_component = new Button(
      {
        style,
        innerText: icon ? undefined : key,
      },
      this.$system
    )

    key_component.addEventListener(
      makePointerDownListener(() => {
        // emitKeyboardEvent(this.$system, 'keydown', {
        //   key,
        //   keyCode,
        //   code,
        //   shiftKey: false,
        //   ctrlKey: false,
        //   metaKey: false,
        //   bubbles: true,
        // })
        // // TODO 'keypress' should not be fired if key is a control key (e.g. ALT, CTRL, SHIFT, ESC)
        // emitKeyboardEvent(this.$system, 'keypress', {
        //   key,
        //   keyCode,
        //   code,
        //   shiftKey: false,
        //   ctrlKey: false,
        //   metaKey: false,
        //   bubbles: true,
        // })
      })
    )

    // key_component.addEventListener(
    //   makePointerUpListener(() => {
    //     emitKeyboardEvent(this.$system, 'keyup', {
    //       key,
    //       keyCode,
    //       code,
    //       shiftKey: false,
    //       ctrlKey: false,
    //       metaKey: false,
    //       bubbles: true,
    //     })
    //   })
    // )
    this._key = key_component

    if (icon !== undefined) {
      const icon_component = new Icon(
        {
          icon,
          style: {
            width: '18px',
            height: '18px',
          },
        },
        this.$system
      )
      key_component.setChildren([icon_component])
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = key_component.$slot
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      key: key_component,
    })

    this.registerRoot(key_component)
  }

  private _get_style = () => {
    const { style = {} } = this.$props
    let { color = 'currentColor' } = style
    color = nameToColor(color) || color

    return {
      ...DEFAULT_STYLE,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: `calc(100%)`,
      width: `calc(100%)`,
      overflow: 'hidden',
      ...userSelect('none'),
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

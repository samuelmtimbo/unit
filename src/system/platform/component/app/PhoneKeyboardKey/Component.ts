import { mergePropStyle } from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { keyToIcon } from '../../../../../client/event/keyboard'
import {
  isChar,
  isControlKey,
  keyToCode,
} from '../../../../../client/event/keyboard/key'
import { emitKeyboardEvent } from '../../../../../client/event/keyboard/write'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Icon from '../../../component/Icon/Component'
import TextBox from '../../../core/component/TextBox/Component'
import Div from '../../Div/Component'

export interface Props {
  style?: Dict<string>
  key?: string
  alt?: string
  shiftKey?: boolean
  altKey?: boolean
  active?: boolean
}

export const DEFAULT_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `calc(100%)`,
  width: `calc(100%)`,
  overflow: 'hidden',
  color: 'currentColor',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderRadius: '2px',
  fontSize: '18px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  textAlign: 'center',
  paddingTop: '9px',
  ...userSelect('none'),
}

export default class PhoneKeyboardKey extends Element<HTMLDivElement, Props> {
  private _key_text: TextBox
  private _key: Div

  private _pointer_in = false
  private _pointer_down = false

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { key = 'a', alt = '', shiftKey = false, style = {} } = this.$props

    const key_text_value = this._key_text_value()

    const icon = keyToIcon[key]

    const key_text = new TextBox(
      {
        value: key_text_value,
        style: {
          width: 'auto',
          height: 'auto',
          ...userSelect('none'),
        },
      },
      this.$system
    )
    this._key_text = key_text

    const alt_key_text = new TextBox(
      {
        value: icon ? undefined : alt,
        style: {
          width: 'auto',
          height: 'auto',
          right: '3px',
          top: '3px',
          fontSize: '12px',
          position: 'absolute',
          ...userSelect('none'),
        },
      },
      this.$system
    )

    const key_component = new Div(
      {
        style: { ...DEFAULT_STYLE, ...style },
      },
      this.$system
    )

    const releasePointer = (pointerId: number) => {
      this._pointer_down = false

      if (this._key.hasPointerCapture(pointerId)) {
        this._key.releasePointerCapture(pointerId)
      }
    }

    key_component.addEventListeners([
      makeClickListener({
        onClick: () => {
          // console.log('PhoneKeyboardKey', 'onClick')

          const { key } = this.$props

          if (key !== undefined) {
            this._emit_key(key)
          }
        },
        onLongPress: () => {
          // console.log('PhoneKeyboardKey', 'onLongPress')

          const { alt } = this.$props

          if (alt === undefined) {
            //
          } else {
            this._emit_key(alt)
          }
        },
      }),
      makePointerEnterListener(() => {
        this._pointer_in = true

        this._refresh_background()
      }),
      makePointerDownListener((event) => {
        const { pointerId } = event

        this._key.setPointerCapture(pointerId)

        this._pointer_down = true

        this._refresh_background()
      }),
      makePointerUpListener((event) => {
        const { pointerId } = event

        releasePointer(pointerId)

        this._refresh_background()
      }),
      makePointerLeaveListener((event) => {
        const { pointerId } = event

        if (this._pointer_down) {
          releasePointer(pointerId)
        }

        this._pointer_in = false

        this._refresh_background()
      }),
      makePointerCancelListener((event) => {
        const { pointerId } = event

        if (this._pointer_down) {
          releasePointer(pointerId)
        }
      }),
    ])
    key_component.preventDefault('mousedown')
    key_component.preventDefault('touchstart')
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
    } else {
      key_component.setChildren([key_text, alt_key_text])
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

  private _key_text_value = (): string | undefined => {
    const { key = 'a', alt = '', shiftKey = false, style = {} } = this.$props

    const icon = keyToIcon[key]

    const key_text_value = icon
      ? undefined
      : isChar(key)
        ? shiftKey
          ? key.toUpperCase()
          : key
        : ''

    return key_text_value
  }

  private _refresh_key_text_value = (): void => {
    const key_text_value = this._key_text_value()
    if (key_text_value) {
      this._key_text.setProp('value', key_text_value)
    }
  }

  private _refresh_background = () => {
    // console.log('PhoneKeyboardKey', '_refresh_background')

    const { $theme, $color } = this.$context

    const { active, style = {} } = this.$props

    const background = this._pointer_in
      ? $theme === 'dark'
        ? '#00000066'
        : '#00000011'
      : style.backgroundColor ?? '#00000022'

    if (active) {
      mergePropStyle(this._key, {
        backgroundImage: `radial-gradient(currentColor 20%, transparent 20%)`,
        backgroundSize: '3px 3px',
        background,
      })
    } else {
      if (this._pointer_down) {
        mergePropStyle(this._key, {
          backgroundImage: `radial-gradient(circle, currentColor 15%, transparent 10%)`,
          backgroundSize: '6px 6px',
          backgroundPosition: '0.75px 0px',
          background,
        })
      } else {
        mergePropStyle(this._key, {
          background,
          backgroundImage: '',
          backgroundSize: '',
        })
      }
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._key.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'shiftKey') {
      this._refresh_key_text_value()
    } else if (prop === 'altKey') {
      this._refresh_key_text_value()
    } else if (prop === 'active') {
      this._refresh_background()
    }
  }

  private _emit_key = (key: string) => {
    const { shiftKey = false, altKey = false } = this.$props
    const _key = shiftKey && isChar(key) ? key.toUpperCase() : key
    emitPhoneKey(this.$system, _key, shiftKey, altKey)
    this.dispatchEvent('key', key)
  }
}

export function emitPhoneKey(
  system: System,
  key: string,
  shiftKey: boolean,
  altKey: boolean
): void {
  const code = keyToCode[key]

  emitKeyboardEvent(system, 'keydown', {
    key,
    code,
    shiftKey,
    altKey,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })

  if (!isControlKey(key)) {
    emitKeyboardEvent(system, 'keypress', {
      key,
      code,
      shiftKey,
      altKey,
      ctrlKey: false,
      metaKey: false,
      bubbles: true,
    })
  }

  emitKeyboardEvent(system, 'keyup', {
    key,
    code,
    shiftKey,
    altKey,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
}

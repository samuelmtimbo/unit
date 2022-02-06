import { Element } from '../../../../../client/element'
import {
  emitKeyboardEvent,
  keyToIcon,
} from '../../../../../client/event/keyboard'
import {
  isChar,
  keyToCode,
  keyToKeyCode,
} from '../../../../../client/event/keyboard/keyCode'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import parentElement from '../../../../../client/platform/web/parentElement'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Div from '../../../component/Div/Component'
import Icon from '../../../component/Icon/Component'
import TextDiv from '../../../core/component/TextDiv/Component'

export interface Props {
  style?: Dict<string>
  key?: string
  alt?: string
  shiftKey?: boolean
  altKey?: boolean
}

export const DEFAULT_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `calc(100%)`,
  width: `calc(100%)`,
  overflow: 'hidden',
  ...userSelect('none'),
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
  private _key_text: TextDiv
  private _key: Div

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { key = 'a', alt = '', shiftKey = false, style = {} } = this.$props

    const key_text_value = this._key_text_value()

    const icon = keyToIcon[key]

    const key_text = new TextDiv(
      {
        value: key_text_value,
        style: {
          width: 'auto',
          height: 'auto',
          ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )
    this._key_text = key_text

    const alt_key_text = new TextDiv(
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
      this.$system,
      this.$pod
    )

    const key_component = new Div(
      {
        style: { ...DEFAULT_STYLE, ...style },
      },
      this.$system,
      this.$pod
    )
    key_component.appendChild(key_text)
    key_component.appendChild(alt_key_text)
    key_component.addEventListener(
      makeClickListener({
        onClick: () => {
          // console.log('PhoneKeyboardKey', 'onClick')
          const { key } = this.$props
          if (key !== undefined) {
            this._emit_key(key)
          }
        },
        onLongPress: () => {
          // log('PhoneKeyboardKey', 'onLongPress')
          const { alt } = this.$props
          if (alt === undefined) {
          } else {
            this._emit_key(alt)
          }
        },
      })
    )
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
        this.$system,
        this.$pod
      )

      key_component.setChildren([icon_component])
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = key_component.$slot
    this.$subComponent = {
      key: key_component,
    }
    this.$unbundled = false

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

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._key.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'shiftKey') {
      this._refresh_key_text_value()
    } else if (prop === 'altKey') {
      this._refresh_key_text_value()
    }
  }

  private _emit_key = (key: string) => {
    const { shiftKey = false, altKey = false } = this.$props
    const _key = shiftKey && isChar(key) ? key.toUpperCase() : key
    emitPhoneKey(_key, shiftKey, altKey)
  }
}

export function emitPhoneKey(
  key: string,
  shiftKey: boolean,
  altKey: boolean
): void {
  const keyCode = keyToKeyCode[key]
  const code = keyToCode[key]
  emitKeyboardEvent('keydown', {
    key,
    keyCode,
    code,
    shiftKey,
    altKey,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
  // TODO 'keypress' should not be fired if key is a control key (e.g. ALT, CTRL, SHIFT, ESC)
  emitKeyboardEvent('keypress', {
    key,
    keyCode,
    code,
    shiftKey,
    altKey,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
  emitKeyboardEvent('keyup', {
    key,
    keyCode,
    code,
    shiftKey,
    altKey,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
}

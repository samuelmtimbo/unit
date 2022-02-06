import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Div from '../../../component/Div/Component'
import PhoneKeyboardKey, { emitPhoneKey } from '../PhoneKeyboardKey/Component'

export interface Props {
  style?: Dict<string>
  keyStyle?: Dict<string>
}

export const DEFAULT_STYLE = {
  boxSizing: 'border-box',
  // minHeight: '210px',
  // minWidth: '300px',
}

const KEY_HEIGHT: number = 30

export default class PhoneKeyboard extends Element<HTMLDivElement, Props> {
  private _keyboard: Div
  private _keys: PhoneKeyboardKey[] = []

  private _shift_key: PhoneKeyboardKey
  private _shift: boolean = false

  private _alt_key: PhoneKeyboardKey
  private _alt: boolean = false

  private _backspace_key: PhoneKeyboardKey
  private _backspace_interval: NodeJS.Timeout | null = null

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = this.$props

    const key_Digit1 = this._key('1', '`', KEY_HEIGHT, {})
    const key_Digit2 = this._key('2', '~', KEY_HEIGHT, {})
    const key_Digit3 = this._key('3', '|', KEY_HEIGHT, {})
    const key_Digit4 = this._key('4', '\\', KEY_HEIGHT, {})
    const key_Digit5 = this._key('5', '%', KEY_HEIGHT, {})
    const key_Digit6 = this._key('6', '^', KEY_HEIGHT, {})
    const key_Digit7 = this._key('7', '&', KEY_HEIGHT, {})
    const key_Digit8 = this._key('8', '*', KEY_HEIGHT, {})
    const key_Digit9 = this._key('9', '{', KEY_HEIGHT, {})
    const key_Digit0 = this._key('0', '}', KEY_HEIGHT, {})

    const line_0 = this._line([
      key_Digit1,
      key_Digit2,
      key_Digit3,
      key_Digit4,
      key_Digit5,
      key_Digit6,
      key_Digit7,
      key_Digit8,
      key_Digit9,
      key_Digit0,
    ])

    const key_KeyQ = this._key('q', '+', KEY_HEIGHT, {})
    const key_KeyW = this._key('w', '×', KEY_HEIGHT, {})
    const key_KeyE = this._key('e', '÷', KEY_HEIGHT, {})
    const key_KeyR = this._key('r', '=', KEY_HEIGHT, {})
    const key_KeyT = this._key('t', '/', KEY_HEIGHT, {})
    const key_KeyY = this._key('y', '_', KEY_HEIGHT, {})
    const key_KeyU = this._key('u', '<', KEY_HEIGHT, {})
    const key_KeyI = this._key('i', '>', KEY_HEIGHT, {})
    const key_KeyO = this._key('o', '[', KEY_HEIGHT, {})
    const key_KeyP = this._key('p', ']', KEY_HEIGHT, {})

    const line_1 = this._line([
      key_KeyQ,
      key_KeyW,
      key_KeyE,
      key_KeyR,
      key_KeyT,
      key_KeyY,
      key_KeyU,
      key_KeyI,
      key_KeyO,
      key_KeyP,
    ])

    const key_Empty0 = this._key('', '', KEY_HEIGHT / 2, {
      visibility: 'hidden',
    })
    const key_KeyA = this._key('a', '!', KEY_HEIGHT, {})
    const key_KeyS = this._key('s', '@', KEY_HEIGHT, {})
    const key_KeyD = this._key('d', '#', KEY_HEIGHT, {})
    const key_KeyF = this._key('f', '$', KEY_HEIGHT, {})
    const key_KeyG = this._key('g', '', KEY_HEIGHT, {})
    const key_KeyH = this._key('h', '', KEY_HEIGHT, {})
    const key_KeyJ = this._key('j', '.', KEY_HEIGHT, {})
    const key_KeyK = this._key('k', '(', KEY_HEIGHT, {})
    const key_KeyL = this._key('l', ')', KEY_HEIGHT, {})
    const key_Empty1 = this._key('', '', KEY_HEIGHT / 2, {
      visibility: 'hidden',
    })

    const line_2 = this._line([
      key_Empty0,
      key_KeyA,
      key_KeyS,
      key_KeyD,
      key_KeyF,
      key_KeyG,
      key_KeyH,
      key_KeyJ,
      key_KeyK,
      key_KeyL,
      key_Empty1,
    ])

    const key_ShiftLeft = this._key('Shift', '', 1.5 * KEY_HEIGHT, {
      paddingTop: '0',
    })
    this._shift_key = key_ShiftLeft.$slotChildren[
      'default'
    ][0] as PhoneKeyboardKey
    this._shift_key.addEventListener(
      makeClickListener({
        onClick: () => {
          this._shift = !this._shift
          if (this._shift) {
            this._activate_shift()
          } else {
            this._deactivate_shift()
          }
          for (let key_component of this._keys) {
            key_component.setProp('shiftKey', this._shift)
          }
        },
      })
    )

    const key_KeyZ = this._key('z', '-', KEY_HEIGHT, {})
    const key_KeyX = this._key('x', "'", KEY_HEIGHT, {})
    const key_KeyC = this._key('c', '"', KEY_HEIGHT, {})
    const key_KeyV = this._key('v', ':', KEY_HEIGHT, {})
    const key_KeyB = this._key('b', ';', KEY_HEIGHT, {})
    const key_KeyN = this._key('n', ',', KEY_HEIGHT, {})
    const key_KeyM = this._key('m', '?', KEY_HEIGHT, {})
    const key_Backspace = this._key('Backspace', '', 1.5 * KEY_HEIGHT, {
      paddingTop: '0',
    })
    this._backspace_key = key_Backspace.$slotChildren[
      'default'
    ][0] as PhoneKeyboardKey
    this._backspace_key.addEventListeners([
      makeClickListener({
        onLongPress: this._on_backspace_long_press,
      }),
      makePointerUpListener(this._on_backspace_pointer_up),
    ])

    const line_3 = this._line([
      key_ShiftLeft,
      key_KeyZ,
      key_KeyX,
      key_KeyC,
      key_KeyV,
      key_KeyB,
      key_KeyN,
      key_KeyM,
      key_Backspace,
    ])

    const key_AltLeft = this._key('AltLeft', '', (3 * KEY_HEIGHT) / 2, {
      paddingTop: '0',
    })
    this._alt_key = key_AltLeft.$slotChildren['default'][0] as PhoneKeyboardKey
    this._alt_key.addEventListener(
      makeClickListener({
        onClick: () => {
          this._alt = !this._alt
          if (this._alt) {
            this._activate_alt()
          } else {
            this._deactivate_alt()
          }
          for (let key_component of this._keys) {
            key_component.setProp('altKey', this._alt)
          }
        },
      })
    )

    const key_ArrowLeft = this._key('ArrowLeft', '', KEY_HEIGHT, {
      paddingTop: '0',
    })
    const key_Space = this._key('Space', undefined, 5.5 * KEY_HEIGHT)
    const key_ArrowRight = this._key('ArrowRight', '', KEY_HEIGHT, {
      paddingTop: '0',
    })
    const key_Enter = this._key('Enter', '', (3 * KEY_HEIGHT) / 2, {
      paddingTop: '0',
    })

    const line_4 = this._line([
      key_AltLeft,
      key_ArrowLeft,
      key_Space,
      key_ArrowRight,
      key_Enter,
    ])

    const keyboard = new Div(
      {
        className: 'keyboard',
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    keyboard.setChildren([line_0, line_1, line_2, line_3, line_4])
    this._keyboard = keyboard

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = keyboard.$slot
    this.$subComponent = {
      keyboard,
    }
    this.$unbundled = false

    this.registerRoot(keyboard)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._keyboard.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'keyStyle') {
      for (const key of this._keys) {
        mergePropStyle(key, current || {})
      }
    }
  }

  private _activate_shift = (): void => {
    mergePropStyle(this._shift_key, {
      backgroundImage: `radial-gradient(currentColor 20%, transparent 20%)`,
      backgroundSize: '3px 3px',
    })
  }

  private _deactivate_shift = (): void => {
    mergePropStyle(this._shift_key, {
      backgroundImage: 'none',
      backgroundSize: 'none',
    })
  }

  private _activate_alt = (): void => {
    mergePropStyle(this._alt_key, {
      backgroundImage: `radial-gradient(currentColor 20%, transparent 20%)`,
      backgroundSize: '3px 3px',
    })
  }

  private _deactivate_alt = (): void => {
    mergePropStyle(this._alt_key, {
      backgroundImage: 'none',
      backgroundSize: 'none',
    })
  }

  private _line = (children: Element[]): Div => {
    const line = new Div(
      {
        className: 'keyboard-line',
        style: {
          display: 'flex',
          width: '100%',
          height: '20%',
          boxSizing: 'border-box',
          justifyContent: 'center',
        },
      },
      this.$system,
      this.$pod
    )
    line.setChildren(children)
    return line
  }

  private _key = (
    key: string,
    altKey: string = '',
    width: number,
    style: Dict<string> = {}
  ): Div => {
    const { keyStyle } = this.$props

    const w = width / KEY_HEIGHT

    const key_component = new PhoneKeyboardKey(
      {
        key,
        style: {
          position: 'relative',
          ...style,
          ...keyStyle,
        },
        alt: altKey,
      },
      this.$system,
      this.$pod
    )

    const key_component_container = new Div(
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100%)',
          width: `calc(${w * 100}%)`,
          boxSizing: 'border-box',
          padding: '2px',
        },
      },
      this.$system,
      this.$pod
    )
    key_component_container.appendChild(key_component)

    this._keys.push(key_component)

    return key_component_container
  }

  private _on_backspace_long_press = (): void => {
    const {
      api: {
        device: { vibrate },
      },
    } = this.$system

    // log('PhoneKeyboard', '_on_backspace_long_press')
    this._backspace_interval = setInterval(() => {
      // log('backspace')
      emitPhoneKey('Backspace', this._shift, this._alt)
      vibrate([10])
    }, 30)
  }

  private _on_backspace_pointer_up = (): void => {
    if (this._backspace_interval) {
      clearInterval(this._backspace_interval)
    }
  }
}

import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../types/global/dom'
import Div from '../../../component/Div/Component'
import KeyboardKey from '../KeyboardKey/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  minHeight: '208px',
  minWidth: '640px',
}

const KEY_HEIGHT: number = 42

export default class Keyboard extends Element<IHTMLDivElement, Props> {
  private _keyboard: Div
  private _keys: KeyboardKey[] = []

  private _key_ShiftLeft: Div

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {} } = this.$props

    const key_Backquote = this._key('`', 0, KEY_HEIGHT)
    const key_Digit1 = this._key('1', 0, KEY_HEIGHT)
    const key_Digit2 = this._key('2', 0, KEY_HEIGHT)
    const key_Digit3 = this._key('3', 0, KEY_HEIGHT)
    const key_Digit4 = this._key('4', 0, KEY_HEIGHT)
    const key_Digit5 = this._key('5', 0, KEY_HEIGHT)
    const key_Digit6 = this._key('6', 0, KEY_HEIGHT)
    const key_Digit7 = this._key('7', 0, KEY_HEIGHT)
    const key_Digit8 = this._key('8', 0, KEY_HEIGHT)
    const key_Digit9 = this._key('9', 0, KEY_HEIGHT)
    const key_Digit0 = this._key('0', 0, KEY_HEIGHT)
    const key_Minus = this._key('-', 0, KEY_HEIGHT)
    const key_Equal = this._key('=', 0, KEY_HEIGHT)
    const key_Backspace = this._key('Backspace', 0, KEY_HEIGHT * 2)

    const line_0 = this._line([
      key_Backquote,
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
      key_Minus,
      key_Equal,
      key_Backspace,
    ])

    const key_Tab = this._key('tab', 0, KEY_HEIGHT * 2)
    const key_KeyQ = this._key('q', 0, KEY_HEIGHT)
    const key_KeyW = this._key('w', 0, KEY_HEIGHT)
    const key_KeyE = this._key('e', 0, KEY_HEIGHT)
    const key_KeyR = this._key('r', 0, KEY_HEIGHT)
    const key_KeyT = this._key('t', 0, KEY_HEIGHT)
    const key_KeyY = this._key('y', 0, KEY_HEIGHT)
    const key_KeyU = this._key('u', 0, KEY_HEIGHT)
    const key_KeyI = this._key('i', 0, KEY_HEIGHT)
    const key_KeyO = this._key('o', 0, KEY_HEIGHT)
    const key_KeyP = this._key('p', 0, KEY_HEIGHT)
    const key_BracketLeft = this._key('[', 0, KEY_HEIGHT)
    const key_BracketRight = this._key(']', 0, KEY_HEIGHT)
    const key_Backslash = this._key('\\', 0, KEY_HEIGHT)

    const line_1 = this._line([
      key_Tab,
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
      key_BracketLeft,
      key_BracketRight,
      key_Backslash,
    ])

    const key_CapsLock = this._key('CapsLock', 0, KEY_HEIGHT * 2)
    const key_KeyA = this._key('a', 0, KEY_HEIGHT)
    const key_KeyS = this._key('s', 0, KEY_HEIGHT)
    const key_KeyD = this._key('d', 0, KEY_HEIGHT)
    const key_KeyF = this._key('f', 0, KEY_HEIGHT)
    const key_KeyG = this._key('g', 0, KEY_HEIGHT)
    const key_KeyH = this._key('h', 0, KEY_HEIGHT)
    const key_KeyJ = this._key('j', 0, KEY_HEIGHT)
    const key_KeyK = this._key('k', 0, KEY_HEIGHT)
    const key_KeyL = this._key('l', 0, KEY_HEIGHT)
    const key_Semicolon = this._key(';', 0, KEY_HEIGHT)
    const key_Quote = this._key("'", 0, KEY_HEIGHT)
    const key_Enter = this._key('Enter', 0, 2 * KEY_HEIGHT)

    const line_2 = this._line([
      key_CapsLock,
      key_KeyA,
      key_KeyS,
      key_KeyD,
      key_KeyF,
      key_KeyG,
      key_KeyH,
      key_KeyJ,
      key_KeyK,
      key_KeyL,
      key_Semicolon,
      key_Quote,
      key_Enter,
    ])

    const key_ShiftLeft = this._key('Shift', 0, 2 * KEY_HEIGHT)
    this._key_ShiftLeft = key_ShiftLeft
    const key = this._key_ShiftLeft.$slotChildren['default'][0]
    this._key_ShiftLeft.addEventListeners([
      makePointerDownListener(() => {
        mergePropStyle(key, {
          backgroundImage: `radial-gradient(currentColor 20%, transparent 20%)`,
          backgroundSize: '3px 3px',
        })
      }),
      makePointerUpListener(() => {
        mergePropStyle(key, {
          backgroundImage: 'none',
          backgroundSize: 'none',
        })
      }),
    ])

    const key_KeyZ = this._key('z', 0, KEY_HEIGHT)
    const key_KeyX = this._key('x', 0, KEY_HEIGHT)
    const key_KeyC = this._key('c', 0, KEY_HEIGHT)
    const key_KeyV = this._key('v', 0, KEY_HEIGHT)
    const key_KeyB = this._key('b', 0, KEY_HEIGHT)
    const key_KeyN = this._key('n', 0, KEY_HEIGHT)
    const key_KeyM = this._key('m', 0, KEY_HEIGHT)
    const key_Comma = this._key(',', 0, KEY_HEIGHT)
    const key_Period = this._key('.', 0, KEY_HEIGHT)
    const key_Slash = this._key('/', 0, KEY_HEIGHT)
    const key_Empty0 = this._key('unknown', 0, KEY_HEIGHT, {
      visibility: 'hidden',
    })
    const key_ArrowUp = this._key('ArrowUp', 0, KEY_HEIGHT, {})
    const key_Empty1 = this._key('', 0, KEY_HEIGHT, {
      visibility: 'hidden',
    })
    const key_ShiftRight = this._key('Shift', 0, 2 * KEY_HEIGHT)

    const line_3 = this._line([
      key_ShiftLeft,
      key_KeyZ,
      key_KeyX,
      key_KeyC,
      key_KeyC,
      key_KeyV,
      key_KeyB,
      key_KeyN,
      key_KeyM,
      key_Comma,
      key_Period,
      key_Slash,
      key_Empty0,
      key_ArrowUp,
      key_Empty1,
    ])

    const key_Fn = this._key('fn', 0, KEY_HEIGHT)
    const key_ControlLeft = this._key('CtrlLeft', 0, (3 * KEY_HEIGHT) / 2)
    const key_AltLeft = this._key('AltLeft', 0, (3 * KEY_HEIGHT) / 2)
    const key_MetaLeft = this._key('MetaLeft', 0, (3 * KEY_HEIGHT) / 2)
    const key_Space = this._key('', 0, 4.5 * KEY_HEIGHT)
    const key_AltRight = this._key('AltRight', 0, (3 * KEY_HEIGHT) / 2)
    const key_ControlRight = this._key('CtrlRight', 0, (3 * KEY_HEIGHT) / 2)
    const key_ArrowLeft = this._key('ArrowLeft', 0, KEY_HEIGHT)
    const key_ArrowDown = this._key('ArrowDown', 0, KEY_HEIGHT)
    const key_ArrowRight = this._key('ArrowRight', 0, KEY_HEIGHT)

    const line_4 = this._line([
      key_MetaLeft,
      key_ControlLeft,
      key_AltLeft,
      key_Space,
      key_AltRight,
      key_ControlRight,
      key_ArrowLeft,
      key_ArrowDown,
      key_ArrowRight,
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

    this.$element = keyboard.$element
    this.$slot = keyboard.$slot
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._keyboard.setProp('style', { ...DEFAULT_STYLE, ...current })
    }
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
    location: number,
    width: number,
    _style: Dict<string> = {}
  ): Div => {
    const w = width / KEY_HEIGHT

    const { style = {} } = this.$props
    let { color = 'currentColor' } = style

    const key_component = new KeyboardKey(
      {
        key,
        location,
        style: {
          color,
          ..._style,
        },
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
          width: `calc(${(w * 100) / 15}%)`,
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
}

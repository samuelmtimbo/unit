import { addListener } from '../../../../client/addListener'
import { Component } from '../../../../client/component'
import { makeCustomListener } from '../../../../client/event/custom'
import parentElement from '../../../../client/parentElement'
import { setAlpha, themeBackgroundColor } from '../../../../client/theme'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../Unlisten'
import PhoneKeyboard from '../../../platform/component/app/PhoneKeyboard/Component'
import IOUNAPPControl from '../GUIControl/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  icon?: string
  width?: number
  height?: number
  x?: number
  y?: number
  collapsed?: boolean
}

export const DEFAULT_STYLE = {}

export const DIM_TIMEOUT_T = 3000

export default class GUIControlKeyboard extends Component<
  HTMLDivElement,
  Props
> {
  private _root: IOUNAPPControl
  private _content: PhoneKeyboard

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {} } = this.$props

    const root = new IOUNAPPControl(
      {
        icon: 'keyboard',
        style: {},
        width: 312,
        height: 210,
        x: 48,
        y: 142,
        collapsed: true,
      },
      this.$system
    )
    root.preventDefault('mousedown')
    root.preventDefault('touchdown')
    this._root = root

    const keyboard = new PhoneKeyboard(
      {
        style: {},
      },
      this.$system
    )
    root.registerParentRoot(keyboard)
    this._content = keyboard

    const $element = parentElement()

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false
    this.$subComponent = {
      root,
      keyboard,
    }

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {}

  private _background_color = (): string => {
    const { $theme } = this.$context
    const backgroundColor = setAlpha(themeBackgroundColor($theme), 0.75)
    return backgroundColor
  }

  private _refresh_color = (): void => {
    const backgroundColor = this._background_color()
    this._content.setProp('keyStyle', {
      backgroundColor,
    })
  }

  private _context_unlisten: Unlisten

  onMount(): void {
    this._context_unlisten = addListener(
      this.$context,
      makeCustomListener('themechanged', () => {
        this._refresh_color()
      })
    )

    this._refresh_color()
  }

  onUnmount(): void {
    this._context_unlisten()
  }
}

import { addListener } from '../../../../../client/addListener'
import { setAlpha } from '../../../../../client/color'
import { Component } from '../../../../../client/component'
import { makeCustomListener } from '../../../../../client/event/custom'
import parentElement from '../../../../../client/platform/web/parentElement'
import { themeBackgroundColor } from '../../../../../client/theme'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import PhoneKeyboard from '../../../../platform/component/app/PhoneKeyboard/Component'
import GUIControl from '../GUIControl/Component'

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
  private _root: GUIControl
  private _content: PhoneKeyboard

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {} } = this.$props

    const root = new GUIControl(
      {
        icon: 'keyboard',
        style: {},
        width: 312,
        height: 210,
        x: 48,
        y: 48,
        _x: 12,
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

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      root,
      keyboard,
    })

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

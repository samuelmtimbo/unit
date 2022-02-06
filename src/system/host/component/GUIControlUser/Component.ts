import { addListener } from '../../../../client/addListener'
import { Component } from '../../../../client/component'
import { makeCustomListener } from '../../../../client/event/custom'
import parentElement from '../../../../client/platform/web/parentElement'
import { setAlpha, themeBackgroundColor } from '../../../../client/theme'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'
import User from '../../../platform/component/app/service/UserControl/Component'
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

export default class GUIControlUser extends Component<HTMLDivElement, Props> {
  private _root: GUIControl
  private _content: User

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {} } = this.$props

    const root = new GUIControl(
      {
        icon: 'user',
        style: {},
        width: 180,
        height: 210,
        x: 48,
        y: 48,
        collapsed: true,
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const user = new User(
      {
        style,
      },
      this.$system,
      this.$pod
    )
    this._content = user

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false
    this.$subComponent = {
      root,
      user,
    }

    this.registerRoot(root)

    root.registerParentRoot(user)
  }

  onPropChanged(prop: string, current: any): void {}

  private _background_color = (): string => {
    const { $theme } = this.$context
    const backgroundColor = setAlpha(themeBackgroundColor($theme), 0.75)
    return backgroundColor
  }

  private _refresh_color = (): void => {
    const backgroundColor = this._background_color()

    this._content.setProp('style', {
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

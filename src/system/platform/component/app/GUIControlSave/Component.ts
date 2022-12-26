import { Component } from '../../../../../client/component'
import parentElement from '../../../../../client/platform/web/parentElement'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../types/global/dom'
import GUIControl from '../GUIControl/Component'
import SaveControl from '../SaveControl/Component'

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

export default class GUIControlSave extends Component<IHTMLDivElement, Props> {
  private _root: GUIControl
  private _content: SaveControl

  constructor($props: Props, $system: System) {
    super($props, $system)

    const root = new GUIControl(
      {
        icon: 'save',
        style: {},
        width: 258,
        height: 336,
        x: 48,
        y: 48,
        _x: 12,
        collapsed: true,
      },
      this.$system
    )
    this._root = root

    const save = new SaveControl(
      {
        style: {},
      },
      this.$system
    )
    this._content = save

    root.registerParentRoot(save)

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false
    this.$subComponent = {
      root,
      save,
    }

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {}
}

import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Div from '../../../component/Div/Component'
import _Text from '../../../component/value/Text/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  tabIndex?: number
  title?: string
  draggable?: boolean
  value?: string
}

export const DEFAULT_STYLE = {
  height: 'fit-content',
}

export default class TextBox extends Element<HTMLDivElement, Props> {
  private _div: Div
  private _text: _Text

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style, tabIndex, title, draggable, value } = this.$props

    const $element = parentElement($system)

    const div = new Div(
      {
        style: { ...DEFAULT_STYLE, ...style },
        className,
        tabIndex,
        title,
        draggable,
      },
      this.$system
    )
    this._div = div

    const text = new _Text(
      {
        value,
      },
      this.$system
    )
    this._text = text

    div.registerParentRoot(text)

    this.$element = $element
    this.$slot = {
      default: div,
    }
    this.$subComponent = {
      div,
      text,
    }

    this.registerRoot(div)
  }

  private _prop_handler = {
    style: (style: Dict<string> | undefined = {}) => {
      this._div.setProp('style', { ...DEFAULT_STYLE, ...style })
    },
    className: (className: string | undefined) => {
      this._div.setProp('className', className)
    },
    tabIndex: (tabIndex: number | undefined) => {
      this._div.setProp('tabIndex', tabIndex)
    },
    title: (title: string | undefined) => {
      this._div.setProp('title', title)
    },
    value: (value: string | undefined) => {
      this._text.setProp('value', value)
    },
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

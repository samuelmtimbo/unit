import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
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

export default class TextDiv extends Element<HTMLDivElement, Props> {
  private _div: Div
  private _text: _Text

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

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
      this.$system,
      this.$pod
    )
    this._div = div

    const text = new _Text(
      {
        value,
      },
      this.$system,
      this.$pod
    )
    this._text = text

    this.$element = $element
    this.$slot = div.$slot

    this.registerRoot(div)

    div.registerParentRoot(text)
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

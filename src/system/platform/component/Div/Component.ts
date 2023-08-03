import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyDynamicStyle } from '../../../../client/style'
import { userSelect } from '../../../../client/util/style/userSelect'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  innerText?: string
  tabIndex?: number
  title?: string
  draggable?: boolean
  data?: Dict<string>
  attr?: Dict<string>
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
  ...userSelect('none'),
}

export default class Div extends Element<HTMLDivElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      id,
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
      data = {},
      attr = {},
    } = this.$props

    this.$element = this.$system.api.document.createElement('div')

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className !== undefined) {
      this.$element.className = className
    }
    if (innerText) {
      this.$element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
    if (title) {
      this.$element.title = title
    }
    if (draggable !== undefined) {
      this.$element.setAttribute('draggable', draggable.toString())
    }
    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]

        this.$element.dataset[key] = d
      }
    }

    applyDynamicStyle(this, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...htmlPropHandler(this, DEFAULT_STYLE),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

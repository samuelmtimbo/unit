import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyStyle } from '../../../../client/style'
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
}

const DEFAULT_STYLE = {
  display: 'inline-block',
  boxSizing: 'border-box',
  width: '60px',
  height: '36px',
  padding: '6px'
}

export default class Button extends Element<HTMLButtonElement, Props> {
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
    } = this.$props

    const $element = this.$system.api.document.createElement('button')

    if (id !== undefined) {
      $element.id = id
    }

    if (className !== undefined) {
      $element.className = className
    }

    if (innerText) {
      $element.innerText = innerText
    }

    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }

    if (title) {
      $element.title = title
    }

    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]
        $element.dataset[key] = d
      }
    }

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this.$element = $element

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

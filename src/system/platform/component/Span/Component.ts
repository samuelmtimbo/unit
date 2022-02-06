import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { Pod } from '../../../../pod'
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
}

const DEFAULT_STYLE = {
  color: 'currentColor',
}

export default class Span extends Element<HTMLSpanElement, Props> {
  private _span_el: HTMLSpanElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { id, className, style, innerText, tabIndex, title, draggable } =
      this.$props

    const $element = this.$system.api.document.createElement('span')

    if (id !== undefined) {
      $element.id = id
    }
    if (className !== undefined) {
      $element.className = className
    }
    applyStyle($element, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      $element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }
    if (title) {
      $element.title = title
    }
    if (draggable !== undefined) {
      $element.setAttribute('draggable', draggable.toString())
    }

    this._span_el = $element

    this._prop_handler = {
      ...htmlPropHandler(this._span_el, DEFAULT_STYLE),
    }

    this.$element = $element
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

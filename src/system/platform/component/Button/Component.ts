import HTMLElement_ from '../../../../client/html'
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

export default class Button extends HTMLElement_<HTMLButtonElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('button'),
      $system.style['button']
    )

    const { id, className, style, innerText, tabIndex, title, draggable } =
      this.$props

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
  }
}

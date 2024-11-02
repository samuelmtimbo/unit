import HTMLElement_ from '../../../../client/html'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  href?: string
  target?: string
  rel?: string
  id?: string
  className?: string
  style?: Dict<string>
  innerText?: string
  tabIndex?: number
  title?: string
  draggable?: boolean
}

export default class Bold extends HTMLElement_<HTMLElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('b'),
      $system.style['bold']
    )

    const {
      href,
      target,
      id,
      rel = 'noreferrer',
      className,
      innerText,
      tabIndex,
      title,
      draggable,
    } = this.$props

    if (href !== undefined) {
      this.$element.setAttribute('href', href)
    }
    if (target !== undefined) {
      this.$element.setAttribute('target', target)
    }
    if (rel !== undefined) {
      this.$element.setAttribute('rel', rel)
    }
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
  }
}

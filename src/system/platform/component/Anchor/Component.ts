import HTMLElement_ from '../../../../client/html'
import { PropHandler } from '../../../../client/propHandler'
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

export default class Anchor extends HTMLElement_<HTMLAnchorElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('a'),
      $system.style['anchor']
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

    this.$propHandler = {
      ...this.$propHandler,
      href: (href: string | undefined) => {
        if (href) {
          this.$element.href = href
        } else {
          this.$element.removeAttribute('href')
        }
      },
      target: (target: string | undefined) => {
        if (target) {
          this.$element.target = target
        } else {
          this.$element.removeAttribute('target')
        }
      },
    }
  }
}

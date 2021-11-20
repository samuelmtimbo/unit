import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { PropHandler, htmlPropHandler } from '../../../../client/propHandler'
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

const DEFAULT_STYLE = {
  color: 'currentColor',
}

export default class Anchor extends Element<HTMLAnchorElement, Props> {
  private _a_el: HTMLAnchorElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      href,
      target,
      id,
      rel = 'noreferrer',
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
    } = this.$props

    const anchor_el = document.createElement('a')

    if (href !== undefined) {
      anchor_el.setAttribute('href', href)
    }

    if (target !== undefined) {
      anchor_el.setAttribute('target', target)
    }

    if (rel !== undefined) {
      anchor_el.setAttribute('rel', rel)
    }

    if (id !== undefined) {
      anchor_el.id = id
    }
    if (className !== undefined) {
      anchor_el.className = className
    }
    applyStyle(anchor_el, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      anchor_el.innerText = innerText
    }
    if (tabIndex !== undefined) {
      anchor_el.tabIndex = tabIndex
    }
    if (title) {
      anchor_el.title = title
    }
    if (draggable !== undefined) {
      anchor_el.setAttribute('draggable', draggable.toString())
    }

    this._a_el = anchor_el

    this._prop_handler = {
      ...htmlPropHandler(this._a_el, DEFAULT_STYLE),

      href: (href: string | undefined) => {
        if (href) {
          this._a_el.href = href
        } else {
          this._a_el.removeAttribute('href')
        }
      },
      target: (target: string | undefined) => {
        if (target) {
          this._a_el.target = target
        } else {
          this._a_el.removeAttribute('target')
        }
      },
    }

    this.$element = anchor_el
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

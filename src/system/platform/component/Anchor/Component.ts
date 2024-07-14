import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyStyle } from '../../../../client/style'
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

const DEFAULT_STYLE = {}

export default class Anchor extends Element<HTMLAnchorElement, Props> {
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

    this.$element = this.$system.api.document.createElement('a')

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

    applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),
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

  onPropChanged<K extends keyof Props>(prop: K, current: any): void {
    this._prop_handler[prop](current)
  }
}

import HTMLElement_ from '../../../../client/html'
import { PropHandler } from '../../../../client/propHandler'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  href?: string
  target?: string
}

export default class Anchor extends HTMLElement_<HTMLAnchorElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('a'),
      $system.style['anchor'],
      {
        rel: 'noreferer',
      },
      {
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
    )

    const { href, target, className } = this.$props

    if (className !== undefined) {
      this.$element.className = className
    }
    if (href !== undefined) {
      this.$element.setAttribute('href', href)
    }
    if (target !== undefined) {
      this.$element.setAttribute('target', target)
    }
  }
}

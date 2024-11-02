import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  href?: string
  className?: string
  style?: Dict<string>
}

export default class SVGUse extends SVGElement_<SVGGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'use'),
      $system.style['use']
    )

    const { className, href } = this.$props

    if (className !== undefined) {
      this.$element.classList.value = className
    }
    if (href !== undefined) {
      this.$element.setAttributeNS(namespaceURI, 'xlink:href', href)
      this.$element.setAttribute('href', href)
    }

    this.$propHandler = {
      ...this.$propHandler,
      href: (href: string | undefined) => {
        if (href) {
          this.$element.setAttributeNS(namespaceURI, 'xlink:href', href)
          this.$element.setAttribute('href', href)
        } else {
          this.$element.removeAttributeNS(namespaceURI, 'xlink:href')
          this.$element.removeAttribute('href')
        }
      },
    }
  }
}

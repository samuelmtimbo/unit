import { namespaceURI } from '../../../../client/component/namespaceURI'
import { ensureIcon } from '../../../../client/ensureIcon'
import { SVGElement_ } from '../../../../client/svg'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  className?: string
  icon?: string
  title?: string
  style?: Dict<string>
  attr?: Dict<string>
  x?: number
  y?: number
  width?: number
  height?: number
  tabIndex?: number
  active?: boolean
}

export default class Icon extends SVGElement_<SVGSVGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'svg'),
      $system.style['icon'],
      {},
      {
        icon: (icon: string | undefined = '') => {
          ensureIcon(this.$system, icon)

          icon_sprite_el.setAttribute('href', `#${icon}`)
        },
      }
    )

    let { className, icon, x, y, width, height, tabIndex } = $props

    const { title } = this.$props

    if (className) {
      this.$element.classList.add(className)
    }
    if (x !== undefined) {
      this.$element.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      this.$element.setAttribute('y', `${y}`)
    }
    if (width !== undefined) {
      this.$element.setAttribute('width', `${width}`)
    }
    if (height !== undefined) {
      this.$element.setAttribute('height', `${height}`)
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
    if (title) {
      const title_el = this.$system.api.document.createElementNS(
        namespaceURI,
        'title'
      )
      title_el.innerHTML = title
      this.$element.appendChild(title_el)
    }

    const icon_sprite_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'use'
    )
    icon_sprite_el.setAttribute('href', `#${icon}`)

    this.$element.appendChild(icon_sprite_el)

    if (icon !== undefined) {
      ensureIcon(this.$system, icon)
    }
  }
}

import { namespaceURI } from '../../../../client/component/namespaceURI'
import { icons } from '../../../../client/icons'
import { SVGElement_ } from '../../../../client/svg'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  className?: string
  icon?: string
  title?: string
  style?: Dict<string>
  attr?: Dict<any>
}

export const DEFAULT_ICON_VIEWBOX = '0 0 24 24'

export default class Icon extends SVGElement_<SVGSVGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'svg'),
      $system.style['icon'],
      {
        viewBox: DEFAULT_ICON_VIEWBOX,
      },
      {
        icon: (icon: string | undefined = '') => {
          const d = icons[icon] ?? ''

          path_el.setAttribute('d', d)
        },
        title: (title: string | undefined = '') => {
          title_el.innerHTML = title
        },
      }
    )

    const { className, icon, title = '' } = $props

    if (className) {
      this.$element.classList.add(className)
    }

    const title_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'title'
    )
    title_el.innerHTML = title
    this.$element.appendChild(title_el)

    const path_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'path'
    )

    const d = icons[icon] ?? ''

    path_el.setAttribute('d', d)

    this.$element.appendChild(path_el)
  }
}

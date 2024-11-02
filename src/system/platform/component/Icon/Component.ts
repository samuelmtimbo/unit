import { applyAttr } from '../../../../client/attr'
import { namespaceURI } from '../../../../client/component/namespaceURI'
import { Element } from '../../../../client/element'
import { ensureIcon } from '../../../../client/ensureIcon'
import { elementPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyDynamicStyle } from '../../../../client/style'
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

export default class Icon extends Element<SVGSVGElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    let {
      className,
      icon,
      style = {},
      attr = {},
      x,
      y,
      width,
      height,
      tabIndex,
    } = $props

    const { title } = this.$props

    const DEFAULT_STYLE = $system.style['icon']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'svg'
    )

    if (attr) {
      applyAttr($element, attr)
    }

    if (className) {
      $element.classList.add(className)
    }
    if (x !== undefined) {
      $element.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      $element.setAttribute('y', `${y}`)
    }
    if (width !== undefined) {
      $element.setAttribute('width', `${width}`)
    }
    if (height !== undefined) {
      $element.setAttribute('height', `${height}`)
    }
    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }
    if (title) {
      const title_el = this.$system.api.document.createElementNS(
        namespaceURI,
        'title'
      )
      title_el.innerHTML = title
      $element.appendChild(title_el)
    }

    const icon_sprite_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'use'
    )
    icon_sprite_el.setAttribute('href', `#${icon}`)

    $element.appendChild(icon_sprite_el)

    this.$element = $element

    if (icon !== undefined) {
      ensureIcon(this.$system, icon)
    }

    applyDynamicStyle(this, this.$element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...elementPropHandler(this, this.$element, DEFAULT_STYLE),
      icon: (icon: string | undefined = '') => {
        ensureIcon(this.$system, icon)

        icon_sprite_el.setAttribute('href', `#${icon}`)
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

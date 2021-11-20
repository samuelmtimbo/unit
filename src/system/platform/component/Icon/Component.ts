import applyStyle from '../../../../client/applyStyle'
import namespaceURI from '../../../../client/component/namespaceURI'
import { Element } from '../../../../client/element'
import { ensureIcon } from '../../../../client/ensureIcon'
import { userSelect } from '../../../../client/style/userSelect'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  className?: string
  icon?: string
  title?: string
  style?: Dict<string>
  x?: number
  y?: number
  width?: number
  height?: number
  tabIndex?: number
  active?: boolean
}

const DEFAULT_STYLE = {
  display: 'flex',
  width: '100%',
  height: '100%',
  strokeWidth: '1.5px',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: 'currentColor',
  fill: 'transparent',
  ...userSelect('none'),
}

export default class Icon extends Element<SVGSVGElement, Props> {
  private _icon_sprite_el: SVGUseElement
  private _svg_el: SVGSVGElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    let { className, icon, style = {}, x, y, width, height, tabIndex } = $props

    const { title } = this.$props

    const $element = document.createElementNS(namespaceURI, 'svg')
    if (className) {
      $element.classList.add(className)
    }
    applyStyle($element, {
      ...DEFAULT_STYLE,
      ...style,
    })
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
      const title_el = document.createElementNS(namespaceURI, 'title')
      title_el.innerHTML = title
      $element.appendChild(title_el)
    }
    this._svg_el = $element

    const icon_sprite_el = document.createElementNS(namespaceURI, 'use')
    icon_sprite_el.setAttribute('href', `#${icon}`)
    this._icon_sprite_el = icon_sprite_el

    $element.appendChild(icon_sprite_el)

    this.$element = $element

    if (icon !== undefined) {
      ensureIcon(this.$system, icon)
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'icon') {
      ensureIcon(this.$system, current)
      this._icon_sprite_el.setAttribute('href', `#${current}`)
    } else if (prop === 'style') {
      applyStyle(this._svg_el, {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }
}

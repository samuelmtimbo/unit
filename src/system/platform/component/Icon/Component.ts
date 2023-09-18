import namespaceURI from '../../../../client/component/namespaceURI'
import { Element } from '../../../../client/element'
import { ensureIcon } from '../../../../client/ensureIcon'
import { elementPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyDynamicStyle } from '../../../../client/style'
import { userSelect } from '../../../../client/util/style/userSelect'
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

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    let { className, icon, style = {}, x, y, width, height, tabIndex } = $props

    const { title } = this.$props

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'svg'
    )
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
    this._svg_el = $element

    const icon_sprite_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'use'
    )
    icon_sprite_el.setAttribute('href', `#${icon}`)
    this._icon_sprite_el = icon_sprite_el

    $element.appendChild(icon_sprite_el)

    this.$element = $element

    if (icon !== undefined) {
      ensureIcon(this.$system, icon)
    }

    // applyStyle($element, {
    //   ...DEFAULT_STYLE,
    //   ...style,
    // })
    applyDynamicStyle(this, this.$element, { ...DEFAULT_STYLE, ...style })

    this.preventDefault('touchstart')

    this._prop_handler = {
      ...elementPropHandler(this, this.$element, DEFAULT_STYLE),
      icon: (icon: string | undefined = '') => {
        ensureIcon(this.$system, icon)

        this._icon_sprite_el.setAttribute('href', `#${icon}`)
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

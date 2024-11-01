import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  href?: string
  startOffset?: string
  spacing?: string
  lengthAdjust?: string
  textContent?: string
  rotate?: 'auto' | 'auto-reverse' | 'number'
}

export default class SVGTextPath extends Element<SVGTextPathElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      style = {},
      className,
      href,
      startOffset,
      lengthAdjust,
      spacing,
      textContent,
      rotate,
    } = this.$props

    const DEFAULT_STYLE = $system.style['textpath']

    const text_path_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'textPath'
    )
    applyStyle(text_path_el, style)
    if (className) {
      text_path_el.classList.add(className)
    }
    if (href !== undefined) {
      text_path_el.setAttribute('href', href)
    }
    if (startOffset !== undefined) {
      text_path_el.setAttribute('startOffset', startOffset)
    }
    if (lengthAdjust !== undefined) {
      text_path_el.setAttribute('lengthAdjust', lengthAdjust)
    }
    if (spacing !== undefined) {
      text_path_el.setAttribute('spacing', spacing)
    }
    if (textContent !== undefined) {
      text_path_el.textContent = textContent
    }
    if (rotate !== undefined) {
      text_path_el.setAttribute('rotate', rotate)
    }

    this.$element = text_path_el

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      textContent: (current: string | undefined) => {
        this.$element.textContent = current
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}

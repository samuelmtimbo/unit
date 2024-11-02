import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
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

export default class SVGTextPath extends SVGElement_<
  SVGTextPathElement,
  Props
> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'textPath'),
      $system.style['textpath']
    )

    const {
      className,
      href,
      startOffset,
      lengthAdjust,
      spacing,
      textContent,
      rotate,
    } = this.$props

    if (className) {
      this.$element.classList.add(className)
    }
    if (href !== undefined) {
      this.$element.setAttribute('href', href)
    }
    if (startOffset !== undefined) {
      this.$element.setAttribute('startOffset', startOffset)
    }
    if (lengthAdjust !== undefined) {
      this.$element.setAttribute('lengthAdjust', lengthAdjust)
    }
    if (spacing !== undefined) {
      this.$element.setAttribute('spacing', spacing)
    }
    if (textContent !== undefined) {
      this.$element.textContent = textContent
    }
    if (rotate !== undefined) {
      this.$element.setAttribute('rotate', rotate)
    }

    this.$propHandler = {
      ...this.$propHandler,
      textContent: (current: string | undefined) => {
        this.$element.textContent = current
      },
    }
  }
}

import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
}

export default class SVGDefs extends SVGElement_<SVGDefsElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'defs'),
      {}
    )

    const { className } = this.$props

    if (className) {
      this.$element.classList.add(className)
    }
  }
}

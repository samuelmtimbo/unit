import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
}

export default class SVGG extends SVGElement_<SVGGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'g'),
      $system.style['g']
    )

    const { className } = this.$props

    if (className !== undefined) {
      this.$element.classList.value = className
    }
  }
}

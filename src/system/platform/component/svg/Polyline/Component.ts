import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  attr?: Dict<any>
  points?: string
}

export const DEFAULT_ATTR = {
  points: '',
}

export default class SVGPolyline extends SVGElement_<
  SVGPolylineElement,
  Props
> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'polyline'),
      $system.style['polyline'],
      {},
      {
        points: (
          points: string | undefined = this.$props.attr.x ?? DEFAULT_ATTR.points
        ) => {
          this.$element.setAttribute('points', `${points}`)
        },
      }
    )

    const { points = DEFAULT_ATTR.points } = $props

    this.$element.setAttribute('points', `${points}`)
  }
}

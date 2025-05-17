import { I } from '.'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'

export interface Props extends I {}

export default class SVGPattern extends SVGElement_<SVGPatternElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'pattern'),
      $system.style['pattern'],
      {},
      {}
    )
  }
}

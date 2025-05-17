import { I } from '.'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'

export interface Props extends I {}

export default class SVGFilterEffectMergeNode extends SVGElement_<
  SVGFEMergeNodeElement,
  Props
> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'feMergeNode'),
      $system.style['feMergeNode'],
      {},
      {}
    )
  }
}

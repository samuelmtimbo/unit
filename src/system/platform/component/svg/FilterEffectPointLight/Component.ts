import { I } from '.'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'

export interface Props extends I {}

export default class SVGFilterEffectPointLight extends SVGElement_<
  SVGFEPointLightElement,
  Props
> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'fePointLight'),
      $system.style['fePointLight'],
      {},
      {}
    )
  }
}

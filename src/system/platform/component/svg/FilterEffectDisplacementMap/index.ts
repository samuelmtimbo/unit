import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_DISPLACEMENT_MAP } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  in: string
  in2: string
  scale: number
  xChannelSelector: string
  yChannelSelector: string
}

export interface O {}

export default class SVGSFilterEffectDisplacementMap extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: [
          'attr',
          'in',
          'in2',
          'scale',
          'xChannelSelector',
          'yChannelSelector',
        ],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_DISPLACEMENT_MAP
    )
  }
}

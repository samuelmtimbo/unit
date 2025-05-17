import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FILTER_EFFECT_TURBULENCE } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  offset: string
  stopColor: string
  stopOpacity: string
}

export interface O {}

export default class SVGTurbulence extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'type', 'baseFrequency', 'numOctaves'],
        o: [],
      },
      {},
      system,
      ID_FILTER_EFFECT_TURBULENCE
    )
  }
}

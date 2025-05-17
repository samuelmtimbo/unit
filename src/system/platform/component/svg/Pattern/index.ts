import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_PATTERN } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
  patternUnits: string
  width: number
  height: number
  fill: string
}

export interface O {}

export default class SVGPattern extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id', 'patternUnits', 'width', 'height', 'fill'],
        o: [],
      },
      {},
      system,
      ID_PATTERN
    )
  }
}

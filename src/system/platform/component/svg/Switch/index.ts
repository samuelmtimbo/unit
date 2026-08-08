import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_SVG_SWITCH } from '../../../../_ids'

export interface I {
  attr: Dict<string>
}

export interface O {}

export default class SVGSwitch extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr'],
        o: [],
      },
      {},
      system,
      ID_SVG_SWITCH
    )
  }
}

import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_TEXT_0 } from '../../../../_ids'

export interface I {
  style: Dict<string>
  class: string
}

export interface O {}

export default class SVGText extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'className'],
        o: [],
      },
      {},
      system,
      ID_TEXT_0
    )
  }
}

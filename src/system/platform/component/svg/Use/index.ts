import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_USE } from '../../../../_ids'

export interface I {
  href: string
  class: string
  style: Dict<string>
}

export interface O {}

export default class SVGUse extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['href', 'class', 'style'],
        o: [],
      },
      {},
      system,
      ID_USE
    )
  }
}

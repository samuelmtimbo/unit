import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_ANCHOR } from '../../../_ids'

export interface I {
  style: object
  attr: Dict<string>
}

export interface O {}

export default class Anchor extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'href', 'target', 'attr'],
        o: [],
      },
      {},
      system,
      ID_ANCHOR
    )
  }
}

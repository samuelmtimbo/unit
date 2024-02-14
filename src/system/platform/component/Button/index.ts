import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_BUTTON } from '../../../_ids'

export interface I {
  style: object
  attr: object
}

export interface O {}

export default class Button extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_BUTTON
    )
  }
}

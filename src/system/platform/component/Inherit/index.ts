import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_INHERIT } from '../../../_ids'
import { Style } from '../../Style'

export type I = {
  style: Style
}

export type O = {}

export default class Inherit extends Element_<I, O> {
  constructor(system: System) {
    super(
      { i: ['style', 'attr'], o: [] },
      { output: { parent: { ref: true } } },
      system,
      ID_INHERIT
    )
  }
}

import { Element_ } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { Style } from '../../Props'

export type I = {
  style: Style
}

export type O = {}

export default class Constrain extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      { i: ['style'], o: [] },
      { output: { parent: { ref: true } } },
      system,
      pod
    )
  }
}

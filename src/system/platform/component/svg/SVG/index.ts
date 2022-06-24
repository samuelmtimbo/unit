import { Element_ } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
  viewBox: string
}

export interface O {}

export default class SVGSVG extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'viewBox'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {}
  }
}

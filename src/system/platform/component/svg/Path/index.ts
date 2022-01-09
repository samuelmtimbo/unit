import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  d: string
  fillRule: string
}

export interface O {}

export default class SVGPath extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'd', 'fillRule'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      d: '',
    }
  }
}

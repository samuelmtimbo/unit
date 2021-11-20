import { Element } from '../../../../../Class/Element/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  d: string
  fillRule: string
}

export interface O {}

export default class SVGPath extends Element<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'd', 'fillRule'],
        o: [],
      },
      {},
      system
    )

    this._defaultState = {
      d: '',
    }
  }
}

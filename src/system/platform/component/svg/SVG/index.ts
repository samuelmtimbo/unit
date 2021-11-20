import { Element } from '../../../../../Class/Element/Element'
import { System } from '../../../../../system'

export interface I {
  style: object
  viewBox: string
}

export interface O {}

export default class SVG extends Element<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'viewBox'],
        o: [],
      },
      {},
      system
    )

    this._defaultState = {}
  }
}

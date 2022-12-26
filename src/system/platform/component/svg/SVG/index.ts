import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_SVG } from '../../../../_ids'

export interface I {
  style: object
  viewBox: string
}

export interface O {}

export default class SVGSVG extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'viewBox'],
        o: [],
      },
      {},
      system,
      ID_SVG
    )

    this._defaultState = {}
  }
}

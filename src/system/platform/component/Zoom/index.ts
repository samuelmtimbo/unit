import { Element_ } from '../../../../Class/Element'
import { Zoom } from '../../../../client/zoom'
import { System } from '../../../../system'
import { ID_ZOOM } from '../../../_ids'

export interface I {
  style: object
  zoom: Zoom
}

export interface O {}

export default class _Zoom extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'zoom', 'width', 'height'],
        o: [],
      },
      {},
      system,
      ID_ZOOM
    )

    this._defaultState = {
      zoom: { x: 0, y: 0, z: 1 },
    }
  }
}

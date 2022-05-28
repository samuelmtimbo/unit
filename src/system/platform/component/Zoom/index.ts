import { Element } from '../../../../Class/Element'
import { Zoom } from '../../../../client/zoom'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  style: object
  zoom: Zoom
}

export interface O {}

export default class _Zoom extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'zoom', 'width', 'height'],
        o: [],
      },
      {},
      system,
      pod
    )

    this._defaultState = {
      zoom: { x: 0, y: 0, z: 1 },
    }
  }
}

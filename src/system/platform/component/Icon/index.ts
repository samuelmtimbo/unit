import { Element_ } from '../../../../Class/Element'
import { UnitPointerEvent } from '../../../../client/event/pointer'
import { System } from '../../../../system'
import { ID_ICON } from '../../../_ids'

export interface I {
  style: object
  icon: string
}

export interface O {
  click: UnitPointerEvent
  pointerenter: UnitPointerEvent
  pointerleave: UnitPointerEvent
}

export default class IconButton extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'icon'],
        o: [],
      },
      {},
      system,
      ID_ICON
    )
  }
}

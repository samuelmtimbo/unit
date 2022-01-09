import { Element } from '../../../../Class/Element'
import { IOPointerEvent } from '../../../../client/event/pointer'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  style: object
  icon: string
}

export interface O {
  click: IOPointerEvent
  pointerenter: IOPointerEvent
  pointerleave: IOPointerEvent
}

export default class IconButton extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'icon'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}

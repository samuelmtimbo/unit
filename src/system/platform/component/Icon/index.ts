import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { IOPointerEvent } from '../../../../client/event/pointer'

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
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'icon'],
        o: [],
      },
      config
    )
  }
}

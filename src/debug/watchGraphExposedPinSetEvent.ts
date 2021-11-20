import { U } from '../interface/U'
import { GraphExposedPinSpec } from '../types'
import { Moment } from './Moment'

export interface GraphExposedPinSetMomentData {
  type: 'input' | 'output'
  pinId: string
  pinSpec: GraphExposedPinSpec
}

export interface GraphExposedPinSetMoment
  extends Moment<GraphExposedPinSetMomentData> {}

export function watchGraphExposedPinSetEvent(
  event: 'expose_pin_set' | 'cover_pin_set',
  unit: U,
  callback: (moment) => void
): () => void {
  const listener = (
    type: 'input' | 'output',
    pinId: string,
    pinSpec: GraphExposedPinSpec
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        pinSpec,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

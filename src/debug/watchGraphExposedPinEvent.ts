import { U } from '../interface/U'
import { GraphExposedSubPinSpec } from '../types'
import { Moment } from './Moment'

export interface GraphExposedPinEventData {
  type: 'input' | 'output'
  pinId: string
  subPinId: string
  subPinSpec: GraphExposedSubPinSpec
}

export interface GraphExposedPinEvent
  extends Moment<GraphExposedPinEventData> {}

export function watchGraphExposedPinEvent(
  event: 'expose_pin' | 'cover_pin',
  unit: U,
  callback: (moment: GraphExposedPinEvent) => void
): () => void {
  const listener = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        subPinId,
        subPinSpec,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

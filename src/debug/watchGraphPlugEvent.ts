import { U } from '../interface/U'
import { GraphExposedSubPinSpec } from '../types'
import { Moment } from './Moment'

export interface GraphPlugMomentData {
  type: 'input' | 'output'
  pinId: string
  subPinId: string
  subPinSpec: GraphExposedSubPinSpec
}

export interface GraphPlugMoment extends Moment<GraphPlugMomentData> {}

export function watchGraphPlugEvent(
  event: 'plug_pin' | 'unplug_pin',
  unit: U,
  callback: (moment: GraphPlugMoment) => void
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

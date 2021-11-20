import { U } from '../interface/U'
import { GraphExposedSubPinSpec } from '../types'
import { Moment } from './Moment'

export interface UnitLeafExposedPinSetEventData {
  path: string[]
  type: 'input' | 'output'
  pinId: string
  subPinId: string
  subPinSpec: GraphExposedSubPinSpec
}

export interface UnitLeafExposedPinSetEvent
  extends Moment<UnitLeafExposedPinSetEventData> {}

export function watchUnitLeafExposedPinSetEvent(
  event: 'leaf_expose_pin_set' | 'leaf_cover_pin_set',
  unit: U,
  callback: (moment: UnitLeafExposedPinSetEvent) => void
): () => void {
  const listener = (
    path: string[],
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
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

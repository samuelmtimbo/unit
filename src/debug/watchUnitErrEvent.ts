import { Unit } from '../Class/Unit'
import { UnitErrMoment } from './UnitErrMoment'

export function watchUnitErrEvent(
  event: 'err' | 'take_err' | 'catch_err',
  unit: Unit,
  callback: (moment: UnitErrMoment) => void
): () => void {
  const listener = (err) => {
    callback({
      type: 'unit',
      event,
      data: { err },
    } as UnitErrMoment)
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

import callAll from '../callAll'
import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { PinType } from './PinType'
import { watchRefPinEvent } from './watchRefPinEvent'

export function watchRefPin(
  type: 'ref_input' | 'ref_output',
  pinType: PinType,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  const all = [
    watchRefPinEvent('data', type, pinType, pinId, pin, callback),
    watchRefPinEvent('drop', type, pinType, pinId, pin, callback),
  ]

  const unlisten = callAll(all)

  return unlisten
}

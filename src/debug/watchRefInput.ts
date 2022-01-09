import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { watchRefPin } from './watchRefPin'

export function watchRefInput(
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  return watchRefPin('ref_input', 'input', pinId, pin, callback)
}

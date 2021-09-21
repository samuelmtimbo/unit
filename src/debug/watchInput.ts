import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { watchPin } from './watchPin'

export function watchDataInput(
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  return watchPin('input', pinId, pin, callback)
}

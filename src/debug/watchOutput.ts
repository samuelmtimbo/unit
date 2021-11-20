import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { watchPin } from './watchPin'

export function watchDataOutput(
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  return watchPin('output', pinId, pin, callback)
}

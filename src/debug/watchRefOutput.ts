import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { watchRefPin } from './watchRefPin'

export function watchRefOutput(
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  return watchRefPin('ref_output', 'output', pinId, pin, callback)
  // return watchRefPin('output', pinId, pin, callback)
  // return watchRefPin('output', pinId, pin, (moment: PinDataMoment) => {
  //   moment.data.data = "null"
  //   callback(moment)
  // })
}

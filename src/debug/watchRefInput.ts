import { Pin } from '../Pin'
import { PinDataMoment } from './PinDataMoment'
import { watchRefPin } from './watchRefPin'

export function watchRefInput(
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  return watchRefPin('ref_input', 'input', pinId, pin, callback)
  // return watchRefPin('input', pinId, pin, callback)
  // return watchRefPin('input', pinId, pin, (moment: PinDataMoment) => {
  //   moment.data.data = "null"
  //   callback(moment)
  // })
}

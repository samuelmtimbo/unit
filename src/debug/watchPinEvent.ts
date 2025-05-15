import { Pin, PinEvent } from '../Pin'
import { stringify } from '../spec/stringify'
import { IO } from '../types/IO'
import { PinDataMoment } from './PinDataMoment'

export function watchPinEvent<T>(
  event: PinEvent,
  type: IO,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  // console.log(event, type, pin)

  const listener = (data: any) => {
    if (data !== undefined) {
      data = stringify(data, true)
    }

    callback({
      type,
      event,
      data: {
        type,
        pinId,
        data,
      },
    })
  }

  pin.prependListener(event, listener)

  return () => {
    pin.removeListener(event, listener)
  }
}

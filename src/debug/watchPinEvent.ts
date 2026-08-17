import { Pin, PinEvent } from '../Pin'
import { stringify } from '../spec/stringify'
import { PinMoment } from './PinMoment'

export function watchPinEvent<T>(
  event: PinEvent,
  pin: Pin<any>,
  callback: (moment: PinMoment) => void
): () => void {
  // console.log(event, type, pin)

  const listener = (data: any) => {
    if (data !== undefined) {
      data = stringify(data, true)
    }

    callback({
      event,
      data: {
        data,
      },
    })
  }

  pin.prependListener(event, listener)

  return () => {
    pin.removeListener(event, listener)
  }
}

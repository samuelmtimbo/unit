import { $ } from '../Class/$'
import { Pin, PinEvent } from '../Pin'
import { stringify } from '../spec/stringify'
import { PinDataMoment } from './PinDataMoment'
import { PinType } from './PinType'

export function watchPinEvent<T>(
  event: PinEvent,
  type: PinType,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  // console.log(event, type, pin)

  const listener = (data) => {
    if (data instanceof $) {
      data = null
    }

    if (data !== undefined) {
      data = stringify(data)
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

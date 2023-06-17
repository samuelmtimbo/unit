import { Pin, PinEvent } from '../Pin'
import { GlobalRefSpec } from '../types/GlobalRefSpec'
import { $_ } from '../types/interface/$_'
import { Moment } from './Moment'
import { PinType } from './PinType'
import { Unit } from '../Class/Unit'
import { stringify } from '../spec/stringify'

export interface RefPinMomentData {
  pinId: string
  type: string
  data: GlobalRefSpec | string
}

export interface RefPinMoment extends Moment<RefPinMomentData> {}

export function specGlobalRef(_data: $_): GlobalRefSpec {
  const globalId = _data.getGlobalId()
  const __ = _data.getInterface()

  const data = { globalId, __, _: undefined }

  return data
}

export function watchRefPinEvent(
  event: PinEvent,
  type: 'ref_input' | 'ref_output',
  pinType: PinType,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: RefPinMoment) => void
): () => void {
  // console.log(event, type, pin)

  const listener = (_data: $_) => {
    const data =
      _data instanceof Function ? stringify(_data) : specGlobalRef(_data)

    callback({
      type,
      event,
      data: { type: pinType, pinId, data },
    })
  }
  pin.prependListener(event, listener)

  if (event === 'data') {
    if (pin.active()) {
      const _data = pin.peak()

      listener(_data)
    }
  }

  return () => {
    pin.removeListener(event, listener)
  }
}

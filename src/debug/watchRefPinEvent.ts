import { $_ } from '../interface/$_'
import { Pin, PinEvent } from '../Pin'
import { Moment } from './Moment'
import { PinType } from './PinType'

export interface GlobalRefSpec {
  globalId: string
  _: string[]
}

export interface RefPinMomentData {
  pinId: string
  type: string
  data: GlobalRefSpec
}

export interface RefPinMoment extends Moment<RefPinMomentData> {}

export function specGlobalRef(_data: $_): GlobalRefSpec {
  const globalId = _data.getGlobalId()
  const _ = _data.getInterface()
  const data = { globalId, _ }
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
    const data = specGlobalRef(_data)
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

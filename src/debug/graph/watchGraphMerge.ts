import { Pin } from '../../Pin'
import { IO } from '../../types/IO'
import { callAll } from '../../util/call/callAll'
import { PinDataMoment } from './../PinDataMoment'
import { watchPinEvent } from './../watchPinEvent'

export function watchGraphMerge(
  mergeId: string,
  type: IO,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  const all = [
    watchPinEvent('data', type, pinId, pin, callback),
    watchPinEvent('drop', type, pinId, pin, callback),
    // watchPinEvent('invalid', type, pinId, pin, callback),
    // watchPinEvent('start', type, pinId, pin, callback),
    // watchPinEvent('end', type, pinId, pin, callback),
  ]

  const unlisten = callAll(all)

  return () => {
    unlisten()
  }
}

import { Pin, PinEvent } from '../Pin'
import { callAll } from '../util/call/callAll'
import { PinDataMoment } from './PinDataMoment'
import { watchPinEvent } from './watchPinEvent'

export function watchPin(
  pin: Pin<any>,
  callback: (moment: PinDataMoment) => void
): () => void {
  const events: PinEvent[] = [
    'data',
    'drop',
    // 'invalid',
    // 'start',
    // 'end'
  ]

  const all = events.map((event) => watchPinEvent(event, pin, callback))

  const unlisten = callAll(all)

  return () => {
    unlisten()
  }
}

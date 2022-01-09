import { DataEvent } from '../../events/DataEvent'
import { _ErrorEvent } from '../../events/ErrorEvent'

export interface IPort {
  send(message: any)
  onmessage(event: DataEvent)
  onerror(event: _ErrorEvent)
  terminate()
}

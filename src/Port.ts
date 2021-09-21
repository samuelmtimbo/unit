import { DataEvent } from './events/DataEvent'
import { _ErrorEvent } from './events/ErrorEvent'

export interface Port {
  send(message: any)
  onmessage(event: DataEvent)
  onerror(event: _ErrorEvent)
  terminate()
}

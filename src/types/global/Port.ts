import { DataEvent } from '../../events/DataEvent'
import { ErrorEvent_ } from '../../events/ErrorEvent'

export interface Port {
  send(message: any): void
  onmessage(event: DataEvent): void
  onerror(event: ErrorEvent_): void
}

import { DataEvent } from '../../events/DataEvent'
import { _ErrorEvent } from '../../events/ErrorEvent'

export interface Port {
  send(message: any): void
  onmessage(event: DataEvent): void
  onerror(event: _ErrorEvent): void
  terminate(): void
}

import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface Channel {
  postMessage(message: any): void
  addListener(event: string, listener: Callback): Unlisten
  close(): void
}

export interface ChannelOpt {
  channel: string
}

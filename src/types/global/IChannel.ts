import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface IChannel {
  postMessage(message: any): void
  addListener(event: string, listener: Callback): Unlisten
  close(): void
}

export interface IChannelOpt {
  channel: string
}

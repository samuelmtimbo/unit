import { $, $Events } from '../Class/$'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type BroadcastChannelEE = {
  message: [string]
  close: [number, string]
}

export type BroadcastChannelEvents<_EE extends Dict<any[]>> = $Events<
  _EE & BroadcastChannelEE
> &
  BroadcastChannelEE

export function wrapBroadcastChannel(
  broadcastChannel: BroadcastChannel,
  system: System
): CH & $<BroadcastChannelEvents<{}>> {
  const channel = new (class Channel
    extends $<BroadcastChannelEvents<{}>>
    implements CH
  {
    __: string[] = ['CH']

    constructor(system: System) {
      super(system)

      broadcastChannel.onmessage = (event: MessageEvent) => {
        const { data } = event

        this.emit('message', data)
      }
    }

    send(data: any): Promise<void> {
      broadcastChannel.postMessage(data)

      return
    }
  })(system)

  return channel
}

import { EventEmitter_ } from '../EventEmitter'
import { Action } from '../types'
import { Dict } from '../types/Dict'

const _transmitterChannel: Dict<BroadcastChannel> = {}
const _receiverChannel: Dict<BroadcastChannel> = {}

const _eventEmitter: EventEmitter_ = new EventEmitter_<any>()

export function openReceiverChannel(channel: string): BroadcastChannel {
  let receiverChannel = _receiverChannel[channel]
  if (!receiverChannel) {
    receiverChannel = new BroadcastChannel(channel)
    receiverChannel.onmessage = function (message: MessageEvent) {
      const { data } = message
      _eventEmitter.emit(channel, data)
    }
    receiverChannel.onmessageerror = function (messageerror: any) {
      // console.log('messageerror', messageerror)
    }
    _receiverChannel[channel] = receiverChannel
  }
  return receiverChannel
}

export function openTransmitterChannel(channel: string): BroadcastChannel {
  let transmitterChannel = _transmitterChannel[channel]
  if (!transmitterChannel) {
    transmitterChannel = new BroadcastChannel(channel)
    _transmitterChannel[channel] = transmitterChannel
  }
  return transmitterChannel
}

export function listenChannel(
  channel: string,
  listener: (data: { broadcastId: string; action: Action }) => void
) {
  openReceiverChannel(channel)
  _eventEmitter.addListener(channel, listener)
  return () => {
    _eventEmitter.removeListener(channel, listener)
  }
}

export function postMessage(channel: string, message: any) {
  const transmitterChannel = openTransmitterChannel(channel)
  transmitterChannel.postMessage(message)
}

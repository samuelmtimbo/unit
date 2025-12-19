import { $, $Events } from '../Class/$'
import { System } from '../system'
import { WebSocketShape } from '../system/platform/api/network/WebSocket'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type WebSocket_EE = {
  message: [string]
  close: [{ code: number; reason: string }]
  error: [string]
  open: [object]
}

export type WebSocketEvents<_EE extends Dict<any[]>> = $Events<
  _EE & WebSocket_EE
> &
  WebSocket_EE

export function wrapWebSocket(
  webSocket: WebSocketShape,
  system: System
): CH & $<WebSocketEvents<{}>> {
  const socket = new (class Socket extends $ implements CH {
    __: string[] = ['CH']

    async send(
      data: string | ArrayBufferLike | Blob | ArrayBufferView
    ): Promise<void> {
      const {
        api: {
          window: { WebSocket },
        },
      } = this.__system

      if (webSocket.readyState === WebSocket.CONNECTING) {
        throw new Error('cannot send on web socket while still connecting')
      }

      if (webSocket.readyState === WebSocket.CLOSED) {
        throw new Error('cannot send on closed web socket')
      }

      webSocket.send(data)

      return
    }
  })(system)

  return socket
}

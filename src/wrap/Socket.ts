import { $, $Events } from '../Class/$'
import { System } from '../system'
import { WebSocketShape } from '../system/platform/api/network/WebSocket'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type SocketEE = {
  message: [string]
  close: [number, string]
  error: [string]
}

export type SocketEvents<_EE extends Dict<any[]>> = $Events<_EE & SocketEE> &
  SocketEE

export function wrapWebSocket(
  webSocket: WebSocketShape,
  system: System
): CH & $<SocketEvents<{}>> {
  const socket = new (class Socket extends $ implements CH {
    __: string[] = ['CH']

    async send(
      data: string | ArrayBufferLike | Blob | ArrayBufferView
    ): Promise<void> {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(data)
      }

      return
    }
  })(system)

  return socket
}

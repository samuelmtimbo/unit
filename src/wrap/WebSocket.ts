import { $, $Events } from '../Class/$'
import { System } from '../system'
import { WebSocketShape } from '../system/platform/api/network/WebSocket'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type WebSocketEE = {
  message: [string]
  close: [{ code: number; reason: string }]
  error: [string]
}

export type WebSocketEvents<_EE extends Dict<any[]>> = $Events<
  _EE & WebSocketEE
> &
  WebSocketEE

export function wrapWebSocket(
  webSocket: WebSocketShape,
  system: System
): CH & $<WebSocketEvents<{}>> {
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

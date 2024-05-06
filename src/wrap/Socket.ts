import { $, $Events } from '../Class/$'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type SocketEE = {
  message: [string]
}

export type SocketEvents<_EE extends Dict<any[]>> = $Events<_EE & SocketEE> &
  SocketEE

export function wrapWebSocket(
  webSocket: WebSocket,
  system: System
): CH & $<SocketEvents<{}>> {
  const socket = new (class Socket extends $ implements CH {
    __: string[] = ['CH']

    async send(data: any): Promise<void> {
      webSocket.send(data)

      return
    }
  })(system)

  return socket
}

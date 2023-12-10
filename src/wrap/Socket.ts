import { $ } from '../Class/$'
import { System } from '../system'
import { CH } from '../types/interface/CH'

export function wrapWebSocket(webSocket: WebSocket, system: System): CH & $ {
  const socket = new (class Socket extends $ implements CH {
    __: string[] = ['CH']

    async send(data: any): Promise<void> {
      webSocket.send(data)

      return
    }
  })(system)

  return socket
}

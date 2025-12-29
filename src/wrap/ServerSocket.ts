import { ServerSocket } from '../API'
import { $, $Events } from '../Class/$'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { CH } from '../types/interface/CH'

export type ServerSocketEE = {
  message: [string]
  close: [{ code: number; message: string }]
}

export type ServerSocketEvents<_EE extends Dict<any[]>> = $Events<
  _EE & ServerSocketEE
> &
  ServerSocketEE

export function wrapServerSocket(
  _socket: ServerSocket,
  system: System
): CH & $<ServerSocketEvents<{}>> {
  const socket = new (class Channel
    extends $<ServerSocketEvents<{}>>
    implements CH
  {
    __: string[] = ['CH']

    constructor(system: System) {
      super(system)

      _socket.onmessage = (data: string) => {
        this.emit('message', data)
      }
      _socket.onclose = (code: number, message: string) => {
        this.emit('close', { code, message })
      }
    }

    send(data: any): Promise<void> {
      _socket.send(data)

      return
    }
  })(system)

  return socket
}

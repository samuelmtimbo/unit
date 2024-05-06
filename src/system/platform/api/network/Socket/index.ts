import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import {
  Semifunctional,
  SemifunctionalEvents,
} from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { wrapWebSocket } from '../../../../../wrap/Socket'
import { ID_SOCKET } from '../../../../_ids'

export type I = {
  url: string
  close: any
}

export type O = {
  channel: CH & $
}

export type Socket_EE = { message: [any] }

export type SocketEvents = SemifunctionalEvents<Socket_EE> & Socket_EE

export default class Socket
  extends Semifunctional<I, O, SocketEvents>
  implements CH
{
  private _web_socket: WebSocket | null = null

  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['channel'],
        i: ['close'],
        o: [],
      },
      {
        output: {
          channel: {
            ref: true,
          },
        },
      },
      system,
      ID_SOCKET
    )
  }

  f({ url }: I, done: Done<O>) {
    if (this._web_socket) {
      this._web_socket.close()
    }

    try {
      this._web_socket = new WebSocket(url)
    } catch (err) {
      if (
        err.message ===
        "Failed to construct 'WebSocket': The URL '' is invalid."
      ) {
        done(undefined, 'malformed url')
      } else {
        done(undefined, err.message.toLowerCase())
      }

      return
    }

    const channel = wrapWebSocket(this._web_socket, this.__system)

    this._web_socket.onopen = () => {
      // console.log('Socket', 'onopen')
    }
    this._web_socket.onmessage = (message) => {
      // console.log('Socket', 'onmessage', message)
      channel.emit('message', message.data)
    }
    this._web_socket.onerror = (event: Event) => {
      // console.log('Socket', 'onerror')
      this.err('error') // TODO
    }
    this._web_socket.onclose = (event: CloseEvent) => {
      const { code, reason } = event
      // console.log('Socket', 'onclose', code, reason)

      this._plunk()
    }

    done({
      channel,
    })
  }

  d() {
    this._plunk()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'close') {
    this._close()
    this._finish()
    // }
  }

  private _finish = () => {
    this._plunk()

    this._forward_empty('channel')

    this._backward('url')
    this._backward('close')
  }

  private _plunk = (): void => {
    this._web_socket.onopen = null
    this._web_socket.onmessage = null
    this._web_socket.onerror = null
    this._web_socket.onclose = null

    this._web_socket = null
  }

  private _close(): void {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.close()
      }
    }
  }

  async send(data: any): Promise<void> {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.send(data)
      }
    }
  }
}

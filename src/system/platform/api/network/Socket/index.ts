import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import {
  Semifunctional_EE,
  SemifunctionalEvents,
} from '../../../../../Class/Semifunctional'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
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

export type Socket_EE = { message: [any]; close: [any, any] }

export type SocketEvents = SemifunctionalEvents<Semifunctional_EE> & Socket_EE

export default class Socket extends Holder<I, O, SocketEvents> implements CH {
  private _web_socket: WebSocket | null = null

  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['channel'],
        i: [],
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
      ID_SOCKET,
      'close'
    )
  }

  f({ url }: I, done: Done<O>) {
    const {
      api: {
        window: { WebSocket },
      },
    } = this.__system

    if (!WebSocket) {
      done(undefined, apiNotSupportedError('WebSocket'))

      return
    }

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
      done({ channel })
    }
    this._web_socket.onmessage = (message) => {
      channel.emit('message', message.data)
    }
    this._web_socket.onerror = (event: Event) => {
      done(undefined, 'could not connect')
    }
    this._web_socket.onclose = (event: CloseEvent) => {
      const { code, reason } = event

      channel.emit('close', code, reason)
    }
  }

  d() {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.close()
      }

      this._web_socket.onopen = null
      this._web_socket.onmessage = null
      this._web_socket.onerror = null
      this._web_socket.onclose = null

      this._web_socket = null
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

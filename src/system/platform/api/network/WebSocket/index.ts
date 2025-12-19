import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import {
  Semifunctional_EE,
  SemifunctionalEvents,
} from '../../../../../Class/Semifunctional'
import { CUSTOM_HEADER_X_WEBSOCKET_ID } from '../../../../../client/platform/web/api/http'
import { intercept } from '../../../../../client/platform/web/api/intercept'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { NOOP } from '../../../../../NOOP'
import { System } from '../../../../../system'
import { CH } from '../../../../../types/interface/CH'
import { WebSocket_EE, wrapWebSocket } from '../../../../../wrap/WebSocket'
import { ID_WEB_SOCKET } from '../../../../_ids'

export type I = {
  url: string
  close: any
}

export type O = {
  channel: CH & $
  open: any
}

export type WebSocketEvents = SemifunctionalEvents<Semifunctional_EE> &
  WebSocket_EE

export interface WebSocketShape {
  readyState: number
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
  close(code?: number, reason?: string): void | Promise<void>
  onopen(evevnt: Event): void
  onmessage(event: MessageEvent): void
  onerror(event: Event): void
  onclose(event: CloseEvent): void
}

export default class WebSocket_ extends Holder<I, O, WebSocketEvents> {
  private _web_socket: WebSocketShape | null = null

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
      ID_WEB_SOCKET,
      'close'
    )
  }

  async f({ url }: I, done: Done<O>, fail: Fail) {
    let {
      api: {
        window: { WebSocket },
        http: { fetch },
      },
      cache: { ws, wss, servers, interceptors },
    } = this.__system

    if (!WebSocket) {
      fail(apiNotSupportedError('WebSocket'))

      return
    }

    const willIntercept = interceptors.some((interceptor) =>
      intercept(interceptor.opt, url)
    )

    const upgrade = async () => {
      return await fetch(
        url,
        {
          method: 'GET',
          headers: {
            Upgrade: 'websocket',
            Connection: 'upgrade',
          },
        },
        servers,
        interceptors
      )
    }

    if (willIntercept) {
      let response: Response

      try {
        response = await upgrade()
      } catch (err) {
        fail('could not connect')

        return
      }

      const redirectStatusCodes = [301, 302, 303, 307, 308]

      if (redirectStatusCodes.includes(response.status)) {
        const newUrl = response.headers.get('Location')

        url = newUrl
      }
    }

    if (url.startsWith('unit://')) {
      let response: Response

      try {
        response = await upgrade()
      } catch (err) {
        fail('could not connect')

        return
      }

      if (response.ok) {
        const internalId = response.headers.get(CUSTOM_HEADER_X_WEBSOCKET_ID)

        this._web_socket = {
          readyState: WebSocket.OPEN,
          send: function (
            data: string | ArrayBufferLike | Blob | ArrayBufferView
          ): void {
            const server = wss[internalId]

            server.onmessage(data)
          },
          close: function (code: number, reason: string): void {
            channel.emit('close', { code, reason })

            const server = wss[internalId]

            server.onclose(code, reason)
          },
          onopen: function (evevnt: Event): void {
            //
          },
          onmessage: function (event: MessageEvent): void {
            const { data } = event

            channel.emit('message', data)
          },
          onerror: function (event: Event): void {
            //
          },
          onclose: function (event: CloseEvent): void {
            //
          },
        }

        ws[internalId] = this._web_socket
      } else {
        fail('failed to connect')

        return
      }
    } else {
      try {
        this._web_socket = new WebSocket(url)
      } catch (err) {
        if (
          err.message ===
          "Failed to construct 'WebSocket': The URL '' is invalid."
        ) {
          fail('malformed url')
        } else {
          fail(err.message.toLowerCase())
        }

        return
      }
    }

    const channel = wrapWebSocket(this._web_socket, this.__system)

    this._web_socket.onopen = () => {
      channel.emit('open', {})
    }
    this._web_socket.onmessage = (message) => {
      channel.emit('message', message.data)
    }
    this._web_socket.onerror = (event: Event) => {
      fail('could not connect')
    }
    this._web_socket.onclose = (event: CloseEvent) => {
      const { code, reason } = event

      channel.emit('close', { code, reason })
    }

    done({ channel })
  }

  async d() {
    if (this._web_socket) {
      this._web_socket.onclose = NOOP
      this._web_socket.onerror = NOOP
      try {
        await this._web_socket.close()
      } catch (err) {
        //
      }

      this._web_socket.onopen = null
      this._web_socket.onmessage = null
      this._web_socket.onerror = null
      this._web_socket.onclose = null

      this._web_socket = null
    }
  }
}

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
  private _webSocket: WebSocketShape | null = null

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
        window: { nextTick },
      },
      cache: { ws, wss, interceptors },
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
        nextTick(() => {
          if (this._webSocket) {
            this._webSocket.readyState = WebSocket.CLOSED

            channel.emit('close', { code: 0, reason: '' })
          }
        })

        return
      }

      if (response.ok) {
        const internalId = response.headers.get(CUSTOM_HEADER_X_WEBSOCKET_ID)

        const webSocket: WebSocketShape = {
          readyState: WebSocket.CLOSED,
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
            channel.emit('open', {})
          },
          onmessage: function (event: MessageEvent): void {
            const { data } = event

            channel.emit('message', data)
          },
          onerror: function (event: Event): void {
            channel.emit('error', '')
          },
          onclose: function (event: CloseEvent): void {
            //
          },
        }

        this._webSocket = webSocket

        nextTick(() => {
          webSocket.readyState = WebSocket.OPEN

          channel.emit('open', {})
        })

        ws[internalId] = this._webSocket
      } else {
        fail('failed to connect')

        return
      }
    } else {
      try {
        this._webSocket = new WebSocket(url)

        this._webSocket.onopen = () => {
          channel.emit('open', {})
        }
        this._webSocket.onmessage = (message) => {
          channel.emit('message', message.data)
        }
        this._webSocket.onerror = (event: Event) => {
          channel.emit('error', '')
        }
        this._webSocket.onclose = (event: CloseEvent) => {
          const { code, reason } = event

          channel.emit('close', { code, reason })
        }
      } catch (err) {
        if (
          err.message ===
          "Failed to construct 'WebSocket': The URL '' is invalid."
        ) {
          fail('malformed url')
        } else if (
          "failed to construct 'websocket': an insecure websocket connection may not be initiated from a page loaded over https."
        ) {
          fail(
            'an insecure websocket connection may not be initiated from a page loaded over https'
          )
        } else {
          fail(err.message.toLowerCase())
        }

        return
      }
    }

    const channel = wrapWebSocket(this._webSocket, this.__system)

    done({ channel })
  }

  async d() {
    if (this._webSocket) {
      const webSocket = this._webSocket

      this._webSocket = null

      webSocket.onclose = NOOP
      webSocket.onerror = NOOP

      try {
        await webSocket.close()
      } catch (err) {
        //
      }

      webSocket.onopen = null
      webSocket.onmessage = null
    }
  }
}

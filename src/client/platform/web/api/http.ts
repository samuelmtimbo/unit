import {
  API,
  Server,
  ServerHandler,
  ServerOpt,
  ServerRequest,
  ServerResponse,
  ServerSocket,
} from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt } from '../../../../system'
import { WebSocketShape } from '../../../../system/platform/api/network/WebSocket'
import { Dict } from '../../../../types/Dict'
import { uuidNotIn } from '../../../../util/id'
import { Waiter } from '../../../../Waiter'
import { __intercept__fetch } from './intercept'

export const CUSTOM_HEADER_X_WEBSOCKET_ID = 'X-WebSocket-Id'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const http: API['http'] = {
    fetch: __intercept__fetch(fetch),
    createServer: (
      opt: ServerOpt,
      servers?: Dict<{ opt: ServerOpt; handler: ServerHandler }>
    ): Server => {
      return {
        listen: (port, handler) => {
          if (servers[port]) {
            throw new Error(`port ${port} is already in use`)
          }

          servers[port] = { opt, handler }

          return () => {
            delete servers[port]
          }
        },
      }
    },
    // @ts-ignore
    EventSource: window.EventSource,
    handleUpgrade: async function (
      request: ServerRequest,
      response: Waiter<ServerResponse>,
      ws: Dict<WebSocketShape>,
      wss: Dict<ServerSocket>
    ): Promise<ServerSocket> {
      const socket: ServerSocket = {
        send: function (data: any): void {
          const client = ws[id]

          client.onmessage(new MessageEvent('message', { data }))
        },
        onmessage: NOOP,
      }

      const id = uuidNotIn(wss)

      response.set({
        url: request.url,
        status: 200, // 101
        statusText: 'OK',
        redirected: false,
        bodyUsed: false,
        type: 'basic',
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Accept': '',
          [CUSTOM_HEADER_X_WEBSOCKET_ID]: id,
        },
        body: '',
        ok: true,
      })

      wss[id] = socket

      return socket
    },
  }

  return http
}

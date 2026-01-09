import {
  API,
  Server,
  ServerOpt,
  ServerRequest,
  ServerResponse,
  ServerSocket,
} from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt, System } from '../../../../system'
import { CUSTOM_HEADER_X_EVENT_SOURCE_ID } from '../../../../system/platform/api/network/EventSource'
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
    createServer: (system: System, opt: ServerOpt): Server => {
      return {
        listen: (port, handler) => {
          const {
            cache: { servers, eventSources },
            api: {
              window: { nextTick },
            },
            intercept,
          } = system

          if (servers[port]) {
            throw new Error(`port ${port} is already in use`)
          }

          servers[port] = { opt, handler }

          const handler_ = async (req: ServerRequest) => {
            const response = await handler(req)

            if (
              req.method === 'GET' &&
              req.headers['Accept'] === 'text/event-stream'
            ) {
              const internalId =
                req.headers[CUSTOM_HEADER_X_EVENT_SOURCE_ID] ?? ''

              const eventSource = eventSources[internalId]

              if (internalId) {
                if (
                  response.status === 200 &&
                  response.headers['Content-Type'] === 'text/event-stream'
                ) {
                  if (eventSource) {
                    eventSource.onopen(new Event('open'))

                    if (response.body instanceof ReadableStream) {
                      nextTick(async () => {
                        await (response.body as ReadableStream)
                          .pipeThrough(new TextDecoderStream())
                          .pipeTo(
                            new WritableStream({
                              write(data: string) {
                                eventSource.onmessage(
                                  new MessageEvent('message', {
                                    data,
                                  })
                                )
                              },
                              close() {
                                eventSource.readyState = EventSource.CLOSED

                                eventSource.onerror(new Event('error'))
                              },
                              abort() {
                                eventSource.readyState = EventSource.CLOSED

                                eventSource.onerror(new Event('error'))
                              },
                            })
                          )
                      })
                    }
                  }
                }
              }
            }

            return response
          }

          const unlisten = intercept(
            {
              urls: [`http://localhost:${port}`, `ws://localhost:${port}`],
            },
            handler_
          )

          return () => {
            delete servers[port]

            unlisten()
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
        onclose: NOOP,
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

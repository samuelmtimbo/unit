import * as http from 'http'
import { JSDOM } from 'jsdom'
import { ReadableStream as ReadableStream_ } from 'node:stream/web'
import { MessageEvent, WebSocket, WebSocketServer } from 'ws'
import {
  Server,
  ServerHandler,
  ServerOpt,
  ServerRequest,
  ServerResponse,
  ServerSocket,
} from '../../../API'
import { BootOpt, System } from '../../../system'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../types/Unlisten'
import { mapObjVK } from '../../../util/object'
import { stringToReadableStream } from '../../../util/readable'
import { Waiter } from '../../../Waiter'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { searchToQuery } from '../web/api/intercept'
import { webBoot } from '../web/boot'
import { NoopCanvasRenderingContext2D } from './canvas'

function incomingMessageToReadableStream(
  system: System,
  incomingMessage: http.IncomingMessage
): ReadableStream<any> {
  const {
    api: {
      window: { ReadableStream },
    },
  } = system

  return new ReadableStream({
    start(controller) {
      incomingMessage.on('data', (chunk) => {
        controller.enqueue(new Uint8Array(chunk))
      })

      incomingMessage.on('end', () => {
        controller.close()
      })

      incomingMessage.on('error', (err) => {
        controller.error(err)
      })
    },
  })
}

export function serverResponseBodyToReadableStream(
  system: System,
  body: ServerResponse['body']
) {
  if (typeof body === 'string') {
    return stringToReadableStream(system, body)
  } else if (body instanceof ReadableStream) {
    return body
  } else {
    throw new Error('unsupported body')
  }
}

export function boot(opt?: BootOpt): [System, Unlisten] {
  const { window } = new JSDOM(`<div id="${SYSTEM_ROOT_ID}"></div>`, {
    url: 'http://localhost/',
  })

  const root = window.document.getElementById(SYSTEM_ROOT_ID)

  window.fetch = globalThis.fetch
  window.HTMLCanvasElement.prototype.getContext = <
    T extends '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer',
  >(
    contextId: T
  ): T extends '2d' ? CanvasRenderingContext2D : any => {
    if (contextId === '2d') {
      return new NoopCanvasRenderingContext2D()
    }

    return null
  }

  // @ts-ignore
  window.WebSocket = WebSocket

  // @ts-ignore
  const [system, unlisten] = webBoot(window, root, opt)

  // @ts-ignore
  system.api.window.ReadableStream = ReadableStream_

  system.api.text.TextEncoder = TextEncoder
  system.api.text.TextDecoder = TextDecoder

  const wss = new WebSocketServer({ noServer: true })

  async function handleIncoming(
    req: http.IncomingMessage,
    handler: ServerHandler
  ): Promise<ServerResponse> {
    const headers = mapObjVK(req.headers, (value) => {
      return (Array.isArray(value) ? value : [value]).join(', ')
    }) as Dict<string>

    const { method } = req

    // @ts-ignore
    const protocol = req.socket.encrypted ? 'https' : 'http'

    const url = `${protocol || 'http'}://${req.headers.host}${req.url}`

    const { pathname: path, port, hostname, origin, search } = new URL(url)

    const query = searchToQuery(search)

    const body = incomingMessageToReadableStream(system, req)

    const head: Promise<Buffer> = new Promise((resolve) => {
      req.once('data', (chunk) => {
        resolve(Buffer.from(chunk))
      })
    })

    const request: ServerRequest = {
      url,
      protocol,
      headers,
      method,
      query,
      path,
      search,
      hostname,
      origin,
      port,
      body,
      _: {
        req,
        head,
      },
    }

    const response: ServerResponse = await handler(request)

    return response
  }

  system.api.http.createServer = (opt: ServerOpt) => {
    const server: Server = {
      listen: function (
        port: number,
        handler: ServerHandler,
        servers: Dict<any>
      ): Unlisten {
        const server = http.createServer(
          async (req: http.IncomingMessage, res: http.ServerResponse) => {
            const response = await handleIncoming(req, handler)

            if (response.status >= 100 && response.status <= 599) {
              res.writeHead(response.status, '', response.headers)
            } else {
              res.writeHead(500)

              res.end()

              return
            }

            const reader = serverResponseBodyToReadableStream(
              system,
              response.body
            ).getReader()

            try {
              while (true) {
                const { done, value } = await reader.read()

                if (done) {
                  break
                }

                res.write(Buffer.from(value))
              }

              res.end()
            } catch (error) {
              res.statusCode = 500

              res.end('Internal Server Error')
            }
          }
        )

        server.on('upgrade', async (req, socket, head) => {
          await handleIncoming(req, handler)
        })

        server.listen(port)

        return () => {
          server.close()
        }
      },
    }

    return server
  }

  system.api.http.handleUpgrade = async (
    request: ServerRequest,
    response: Waiter<ServerResponse>
  ) => {
    return new Promise(async (resolve) => {
      const req = request._.req as http.IncomingMessage
      const head = await request._.head

      wss.handleUpgrade(req, req.socket, head, (ws) => {
        wss.emit('connection', ws, req)

        // ws.on('error', (err) => {
        //   console.error(`WebSocket error: ${err.message}`)
        // })

        // ws.on('close', (code, reason) => {
        //   console.log(
        //     `WebSocket connection closed. Code: ${code}, Reason: ${reason}`
        //   )
        // })

        const socket: ServerSocket = {
          send: function (
            data: string | ArrayBufferLike | Blob | ArrayBufferView
          ): void {
            ws.send(data)
          },

          set onmessage(
            handler: (
              data: string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[]
            ) => void
          ) {
            ws.onmessage = (event: MessageEvent) => {
              const { data } = event

              handler(data)
            }
          },
        }

        resolve(socket)
      })
    })
  }

  return [system, unlisten]
}

export default null

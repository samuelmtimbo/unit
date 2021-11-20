import { Callback } from '../../../../../Callback'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../Unlisten'

export interface IHTTPServer {
  listen: (
    port: number,
    listener: (
      req: IHTTPClientRequest,
      done: Callback<IHTTPServerResponse>
    ) => void
  ) => Unlisten
}

export interface IHTTPServerOpt {
  timeout: number
}

export interface IHTTPServerResponse {
  status: number
  body: string
}

export interface IHTTPClientRequest {
  method: 'GET' | 'POST'
  path: string
  query: Dict<any>
  body: string
}

export type I = {
  opt: IHTTPServerOpt
  port: number
  res: IHTTPServerResponse
  done: any
}

export type O = {
  req: IHTTPServerResponse
}

export default class _HTTPServer extends Semifunctional {
  private _server: IHTTPServer

  constructor(config?: Config) {
    super(
      { fi: ['opt'], fo: [], i: ['port', 'res', 'done'], o: ['req'] },
      config
    )
  }

  f({ opt }: I, done: Done<O>) {
    const { timeout } = opt

    const {
      api: {
        http: { local: HTTPServer },
      },
    } = this.$system

    if (!HTTPServer) {
      done(undefined, 'HTTP Server API not supported')
    }

    const server = HTTPServer(opt)

    this._server = server
  }

  private _buffer: [IHTTPClientRequest, Callback<IHTTPServerResponse>][] = []

  onIterDataInputData(name: string, data: any): void {
    if (name === 'port') {
      if (this._server) {
        const port = data as number

        this._server.listen(
          port,
          (req: IHTTPClientRequest, done: Callback<IHTTPServerResponse>) => {
            this._buffer.unshift([req, done])
          }
        )
      }
    }
  }
}

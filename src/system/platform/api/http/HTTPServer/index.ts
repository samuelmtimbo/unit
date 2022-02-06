import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { Dict } from '../../../../../types/Dict'
import {
  IHTTPServer,
  IHTTPServerOpt,
} from '../../../../../types/global/IHTTPServer'

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

  constructor(system: System, pod: Pod) {
    super(
      { fi: ['opt'], fo: [], i: ['port', 'res', 'done'], o: ['req'] },
      {},
      system,
      pod
    )
  }

  f({ opt }: I, done: Done<O>) {
    const { timeout } = opt

    const {
      api: {
        http: {
          server: { local: HTTPServer },
        },
      },
    } = this.__system

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

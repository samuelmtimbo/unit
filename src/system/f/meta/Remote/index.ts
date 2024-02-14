import { AsyncWorkerGraph } from '../../../../AsyncWorker'
import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { RemotePort } from '../../../../RemotePort'
import { EXEC, INIT, TERMINATE } from '../../../../constant/STRING'
import { System } from '../../../../system'
import { Port } from '../../../../types/global/Port'
import { $Graph } from '../../../../types/interface/async/$Graph'
import { $wrap } from '../../../../wrap'
import { ID_REMOTE_GRAPH } from '../../../_ids'

export interface I {
  opt: {}
  close: any
  message: any
}

export interface O {
  graph: $Graph & $
  message: any
}

export default class Remote extends Semifunctional<I, O> {
  private _remote_port: RemotePort
  private _port: Port

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['close', 'message'],
        o: ['message', 'graph'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_REMOTE_GRAPH
    )

    this.addListener('destroy', () => {
      this._close()
    })

    this.addListener('take_err', () => {
      //
    })

    this.addListener('take_caught_err', () => {
      //
    })
  }

  f({ opt }: I, done: Done<O>) {
    //
  }

  async onIterDataInputData(name: string, _data: any): Promise<void> {
    // console.log('Remote', 'onIterDataInputData', name, message)

    switch (name) {
      case 'close':
        this._close()

        this._done()

        this._backward('close')

        break
      case 'message':
        {
          // console.log('Remote', 'message', message)

          const { type, data } = _data

          switch (type) {
            case EXEC:
              {
                this._port.onmessage({ data })
              }
              break
            case INIT:
              {
                const port: Port = {
                  send: (data) => {
                    // const message = stringify(data)

                    this._output.message.push(data)
                  },
                  onmessage(data: any) {
                    // TODO
                  },
                  onerror() {
                    // TODO
                  },
                  terminate() {
                    // TODO
                  },
                }

                this._port = port

                const remote_port = new RemotePort(port)

                this._remote_port = remote_port

                const $graph: $Graph = AsyncWorkerGraph(remote_port)

                const graph = $wrap<$Graph>(this.__system, $graph, [
                  'U',
                  'C',
                  'G',
                ])

                this._output.graph.push(graph)
              }
              break
            case TERMINATE:
              {
                this._close()
              }
              break
          }

          this._backward('message')
        }

        break
    }
  }

  private _close = () => {
    // console.log('Remote', '_close')

    if (this._remote_port) {
      this._remote_port.close()

      this._remote_port = undefined
    }
  }
}

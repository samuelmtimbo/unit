import { AsyncWorker } from '../../../../AsyncWorker'
import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
import { RemotePort } from '../../../../RemotePort'
import { EXEC, INIT, TERMINATE } from '../../../../constant/STRING'
import { System } from '../../../../system'
import { Port } from '../../../../types/global/Port'
import { UCGEE } from '../../../../types/interface/UCGEE'
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

export default class Remote extends Holder<I, O> {
  private _remote_port: RemotePort
  private _port: Port

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['message'],
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
      ID_REMOTE_GRAPH,
      'close'
    )

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

  d() {
    if (this._remote_port) {
      this._remote_port.close()

      this._remote_port = undefined
    }
  }

  async onIterDataInputData(name: keyof I, _data: any): Promise<void> {
    // console.log('Remote', 'onIterDataInputData', name, message)

    super.onIterDataInputData(name, _data)

    if (name === 'message') {
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
                this._output.message.push(data)
              },
              onmessage(data: any) {
                // TODO
              },
              onerror() {
                // TODO
              },
            }

            this._port = port

            const remote_port = new RemotePort(port)

            this._remote_port = remote_port

            const $graph: $Graph = AsyncWorker(remote_port, UCGEE)

            const graph = $wrap<$Graph>(this.__system, $graph, UCGEE)

            this._output.graph.push(graph)
          }
          break
        case TERMINATE:
          {
            this.d()
          }
          break
      }

      this._backward('message')
    }
  }
}
